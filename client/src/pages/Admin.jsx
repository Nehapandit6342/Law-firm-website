import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
function Admin() {
  const [activeTab, setActiveTab] = useState("services");

  const [services, setServices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const unreadCount = contacts.filter((c) => !c.is_read).length;
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editLongDescription, setEditLongDescription] = useState("");
  const [team, setTeam] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const [consultations, setConsultations] = useState([]);
  // ================= FETCH SERVICES =================
  async function fetchServices() {
    const res = await axios.get("http://localhost:5000/services");
    setServices(res.data);
  }
  //====Consultations===//

  async function fetchConsultations() {
    const res = await axios.get("http://localhost:5000/consultations", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    setConsultations(res.data);
  }
  // ================= FETCH CONTACTS =================
  async function fetchContacts() {
    const res = await axios.get("http://localhost:5000/contacts");
    setContacts(res.data);
  }
  //======== fetch team=======
  async function fetchTeam() {
    const res = await axios.get("http://localhost:5000/team");
    setTeam(res.data);
  }

  useEffect(() => {
    fetchServices();
    fetchContacts();
    fetchTeam();
    fetchConsultations();
    // AUTO REFRESH EVERY 5 SECONDS
    const interval = setInterval(() => {
      fetchContacts();
    }, 5000);

    // CLEANUP
    return () => clearInterval(interval);
  }, []);

  // ================= ADD SERVICE =================
  async function handleAdd(e) {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/services",
      {
        title,
        short_description: shortDescription,
        long_description: longDescription,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
    );

    setTitle("");
    setShortDescription("");
    setLongDescription("");
    fetchServices();
    setActiveTab("services");
  }

  // ================= EDIT SERVICE =================
  function startEdit(service) {
    setEditId(service.id);
    setEditTitle(service.title);
    setEditShortDescription(service.short_description);
    setEditLongDescription(service.long_description);
  }

  function cancelEdit() {
    setEditId(null);
    setEditTitle("");
    setEditShortDescription("");
    setEditLongDescription("");
  }

  async function updateService(id) {
    await axios.put(
      `http://localhost:5000/services/${id}`,
      {
        title: editTitle,
        short_description: editShortDescription,
        long_description: editLongDescription,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
    );

    cancelEdit();
    fetchServices();
  }

  async function deleteService(id) {
    await axios.delete(`http://localhost:5000/services/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    fetchServices();
  }

  // ================= MARK READ / UNREAD =================
  async function toggleRead(id, current) {
    await axios.put(`http://localhost:5000/contacts/${id}/read`, {
      is_read: !current,
    });

    fetchContacts();
  }

  async function markAllAsRead() {
    await axios.put("http://localhost:5000/contacts/read-all");

    fetchContacts();
  }
  async function deleteMessage(id) {
    try {
      await axios.delete(`http://localhost:5000/contacts/${id}`);

      fetchContacts();
    } catch (err) {
      console.log(err);
    }
  }

  // ================= SIDEBAR BUTTON =================
  const SidebarButton = ({ label, tab, badge }) => (
    <button
      onClick={() => {
        setActiveTab(tab);

        // AUTO MARK READ
        if (tab === "messages") {
          markAllAsRead();
        }
      }}
      className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition ${
        activeTab === tab
          ? "bg-yellow-400 text-black font-semibold"
          : "hover:bg-slate-800 text-gray-300"
      }`}
    >
      <span>{label}</span>

      {/* 🔴 BADGE (only shows if > 0) */}
      {badge > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-slate-900 p-5 border-r border-white/10">
        <h1 className="text-2xl font-bold text-yellow-400 mb-8">
          Admin Dashboard
        </h1>

        <div className="space-y-2">
          <SidebarButton label="Services" tab="services" />
          <SidebarButton label="Add Service" tab="add" />
          <SidebarButton label="Team" tab="team" />
          <SidebarButton
            label="Customer Messages"
            tab="messages"
            badge={unreadCount}
          />
          <SidebarButton label="Consultations" tab="consultations" />
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="mt-10 w-full bg-red-500 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-10">
        {/* ================= SERVICES ================= */}
        {activeTab === "services" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">
              Services
            </h2>

            <div className="grid gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-800 p-5 rounded-xl border border-white/10"
                >
                  {editId === s.id ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 mb-2 bg-slate-700 rounded"
                      />

                      {/* SHORT DESCRIPTION */}
                      <textarea
                        value={editShortDescription}
                        onChange={(e) =>
                          setEditShortDescription(e.target.value)
                        }
                        placeholder="Short Description (max 120 characters)"
                        maxLength={120}
                        className="w-full p-3 mb-3 bg-slate-700 rounded"
                      />

                      <p className="text-sm text-gray-400 mb-4">
                        {editShortDescription.length}/120
                      </p>

                      {/* LONG DESCRIPTION */}
                      <textarea
                        value={editLongDescription}
                        onChange={(e) => setEditLongDescription(e.target.value)}
                        placeholder="Long Description"
                        maxLength={5000}
                        rows={10}
                        className="w-full p-3 mb-3 bg-slate-700 rounded"
                      />

                      <p className="text-sm text-gray-400 mb-4">
                        {editLongDescription.length}/5000
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateService(s.id)}
                          className="bg-yellow-400 text-black px-3 py-1 rounded"
                        >
                          Save
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">{s.title}</h3>
                      <p className="text-gray-300">{s.short_description}</p>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => startEdit(s)}
                          className="bg-blue-500 px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteService(s.id)}
                          className="bg-red-500 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ================= ADD SERVICE ================= */}
        {activeTab === "add" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-green-400">
              Add New Service
            </h2>

            <form
              onSubmit={handleAdd}
              className="bg-slate-900 p-6 rounded-xl border border-white/10"
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Service Title"
                className="w-full p-3 mb-3 bg-slate-800 rounded"
              />

              {/* SHORT DESCRIPTION */}
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Short Description (max 120 characters)"
                maxLength={120}
                className="w-full p-3 mb-2 bg-slate-800 rounded"
              />

              <p className="text-sm text-gray-400 mb-4">
                {shortDescription.length}/120
              </p>

              {/* LONG DESCRIPTION */}
              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Long Description"
                rows={10}
                maxLength={5000}
                className="w-full p-3 mb-2 bg-slate-800 rounded"
              />

              <p className="text-sm text-gray-400 mb-4">
                {longDescription.length}/5000
              </p>

              <button className="bg-green-500 px-4 py-2 rounded">
                Add Service
              </button>
            </form>
          </div>
        )}
        {/* ================= ADD TEAM ================= */}
        {activeTab === "team" && (
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Manage Team
            </h2>

            {/* ADD FORM */}
            <div className="bg-slate-900 p-5 rounded-xl mb-6">
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-2 bg-slate-800 rounded"
              />

              <input
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 mb-2 bg-slate-800 rounded"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full p-2 mb-2 bg-slate-800 rounded"
              />

              <button
                onClick={async () => {
                  const formData = new FormData();

                  formData.append("name", name);
                  formData.append("role", role);
                  formData.append("image", image);

                  await axios.post("http://localhost:5000/team", formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: localStorage.getItem("token"),
                    },
                  });

                  setName("");
                  setRole("");
                  setImage(null);

                  fetchTeam();
                }}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Add Member
              </button>
            </div>

            {/* TEAM LIST (NOW OUTSIDE FORM) */}
            <div className="grid md:grid-cols-3 gap-4">
              {team.map((t) => (
                <div key={t.id} className="bg-slate-800 p-4 rounded-xl">
                  <img
                    src={`http://localhost:5000${t.image}`}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="font-bold mt-2">{t.name}</h3>
                  <p className="text-gray-400">{t.role}</p>

                  <button
                    onClick={async () => {
                      await axios.delete(`http://localhost:5000/team/${t.id}`, {
                        headers: {
                          Authorization: getToken(),
                        },
                      });
                      fetchTeam();
                    }}
                    className="mt-2 bg-red-500 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ================= MESSAGES ================= */}
        {activeTab === "messages" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">
              Customer Messages
            </h2>

            <div className="grid gap-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className={`p-5 rounded-xl border transition ${
                    c.is_read
                      ? "bg-slate-800 border-white/10"
                      : "bg-slate-700 border-yellow-400"
                  }`}
                >
                  {/* TOP */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{c.name}</h3>

                      <p className="text-gray-300 text-sm">📧 {c.email}</p>

                      <p className="text-gray-300 text-sm">📞 {c.phone}</p>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-2">
                      {/* MARK READ */}
                      <button
                        onClick={() => toggleRead(c.id, c.is_read)}
                        className="text-xs px-3 py-1 rounded bg-yellow-400 text-black hover:scale-105 transition"
                      >
                        {c.is_read ? "Unread" : "Read"}
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => deleteMessage(c.id)}
                        className="text-xs px-3 py-1 rounded bg-red-500 text-white hover:scale-105 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* SUBJECT */}
                  <span className="inline-block mt-2 bg-slate-900 text-yellow-400 px-2 py-1 text-xs rounded">
                    {c.subject}
                  </span>

                  {/* MESSAGE */}
                  <p className="mt-3 bg-slate-900 p-3 rounded text-gray-200">
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "consultations" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">
              Consultation Requests
            </h2>

            <div className="grid gap-4">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-800 p-5 rounded-xl border border-white/10"
                >
                  <h3 className="text-xl font-bold text-yellow-400">
                    {c.name}
                  </h3>

                  <p className="text-gray-300">📧 {c.email}</p>
                  <p className="text-gray-300">📞 {c.phone}</p>

                  <p className="mt-2">
                    <span className="font-semibold text-white">Service:</span>{" "}
                    {c.service}
                  </p>

                  <p>
                    <span className="font-semibold text-white">Date:</span>{" "}
                    {c.date}
                  </p>

                  <p>
                    <span className="font-semibold text-white">Time:</span>{" "}
                    {c.time}
                  </p>

                  <div className="mt-4 bg-slate-900 p-4 rounded">
                    <p className="text-gray-300">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
