import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
function Contact() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultService = queryParams.get("service") || "";
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: defaultService,
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);
  async function fetchServices() {
    try {
      const res = await axios.get("http://localhost:5000/services");
      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function validateForm() {
    let newErrors = {};

    // NAME
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    // EMAIL
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // PHONE
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (form.phone.length < 7) {
      newErrors.phone = "Phone number too short";
    }

    // SUBJECT
    if (!form.subject.trim()) {
      newErrors.subject = "Please select a subject";
    }

    // MESSAGE
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      //  CHECK HTTP STATUS FIRST
      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.success) {
        alert("Message sent successfully!");

        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("CONTACT ERROR:", error);
      alert("Something went wrong");
    }
  }
  return (
    <section
      id="contact"
      className="min-h-screen bg-slate-950 text-white px-10 py-20 flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-slate-900 p-8 rounded-2xl shadow-2xl border border-white/10"
      >
        <h1 className="text-3xl font-bold mb-6 text-yellow-400">Contact Us</h1>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-2 p-3 rounded bg-slate-800 border border-white/10 outline-none"
        />

        {errors.name && (
          <p className="text-red-500 text-sm mb-3">{errors.name}</p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-2 p-3 rounded bg-slate-800 border border-white/10 outline-none"
        />

        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email}</p>
        )}

        {/* PHONE + SUBJECT */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-800 border border-white/10 outline-none"
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-800 border border-white/10 outline-none"
            >
              <option value="">Select Subject</option>

              {services.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>

            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
        </div>

        {/* MESSAGE */}
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          className="w-full mb-2 p-3 rounded bg-slate-800 border border-white/10 outline-none"
        />

        {errors.message && (
          <p className="text-red-500 text-sm mb-4">{errors.message}</p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black py-3 rounded font-semibold hover:scale-105 transition"
        >
          Submit
        </button>
      </form>
    </section>
  );
}

export default Contact;
