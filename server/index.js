require("dotenv").config();

const express = require("express");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const pool = require("./db");

const app = express();

const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
app.use(cors());
app.use(express.json());
// ================= AUTH MIDDLEWARE =================
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Only allow one admin email
    if (email !== "admin@lawfirm.com") {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const admin = await pool.query("SELECT * FROM admins WHERE email=$1", [
      email,
    ]);

    if (admin.rows.length === 0) {
      return res.json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.rows[0].password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: admin.rows[0].id,
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.log(err);
  }
});

/* ================= GET SERVICES ================= */

app.get("/services", async (req, res) => {
  try {
    const services = await pool.query(
      "SELECT * FROM services ORDER BY id DESC",
    );

    res.json(services.rows);
  } catch (error) {
    console.log(error);
  }
});

/* ================= ADD SERVICE ================= */

app.post("/services", verifyAdmin, async (req, res) => {
  try {
    const { title, short_description, long_description } = req.body;

    await pool.query(
      "INSERT INTO services(title, short_description, long_description) VALUES($1,$2,$3)",
      [title, short_description, long_description],
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/services/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, short_description, long_description } = req.body;

    await pool.query(
      "UPDATE services SET title=$1, short_description=$2, long_description=$3 WHERE id=$4",
      [title, short_description, long_description, id],
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});
/* ================= DELETE SERVICE ================= */

app.delete("/services/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM services WHERE id=$1", [id]);

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

/* ================= UPDATE HERO IMAGE ================= */

app.put("/settings", async (req, res) => {
  try {
    const { heroimage } = req.body;

    await pool.query("UPDATE settings SET heroimage=$1 WHERE id=1", [
      heroimage,
    ]);

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

/* ================= GET HERO IMAGE ================= */

app.get("/settings", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM settings LIMIT 1");

    res.json(data.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

app.post("/contact", async (req, res) => {
  try {
    console.log("CONTACT RECEIVED:", req.body);

    const { name, email, phone, subject, message } = req.body;

    await pool.query(
      "INSERT INTO contacts(name,email,phone,subject,message) VALUES($1,$2,$3,$4,$5)",
      [name, email, phone, subject, message],
    );

    res.json({ success: true });
  } catch (err) {
    console.log("CONTACT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/contacts", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT id, name, email, phone, subject, message, COALESCE(is_read,false) as is_read FROM contacts ORDER BY id DESC",
    );

    res.json(data.rows);
  } catch (err) {
    console.log(err);
  }
});

app.put("/contacts/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("UPDATE contacts SET is_read = NOT is_read WHERE id=$1", [
      id,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

app.put("/contacts/read-all", async (req, res) => {
  try {
    await pool.query("UPDATE contacts SET is_read=true WHERE is_read=false");

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

app.delete("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM contacts WHERE id=$1", [id]);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});
app.post("/consultations", async (req, res) => {
  try {
    const { name, email, phone, service, date, time, message } = req.body;

    await pool.query(
      `
      INSERT INTO consultations
      (name,email,phone,service,date,time,message)
      VALUES($1,$2,$3,$4,$5,$6,$7)
    `,
      [name, email, phone, service, date, time, message],
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});
app.get("/consultations", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM consultations ORDER BY id DESC",
    );

    res.json(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});
// ================= TEAM =================

// GET TEAM

app.get("/team", async (req, res) => {
  const data = await pool.query("SELECT * FROM team ORDER BY id DESC");
  res.json(data.rows);
});
// ADD TEAM MEMBER
app.post("/team", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, role } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query("INSERT INTO team(name, role, image) VALUES($1,$2,$3)", [
      name,
      role,
      image,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});
app.put("/team/:id", async (req, res) => {
  const { id } = req.params;
  const { name, role, image } = req.body;

  await pool.query("UPDATE team SET name=$1, role=$2, image=$3 WHERE id=$4", [
    name,
    role,
    image,
    id,
  ]);

  res.json({ success: true });
});
// Delete team member
app.delete("/team/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM team WHERE id=$1", [id]);

  res.json({ success: true });
});
app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT, () => {
  console.log("Server Running on Port 5000");
});
