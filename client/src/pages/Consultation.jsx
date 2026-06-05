import { useState } from "react";
import axios from "axios";
function Consultation() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    message: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/consultations", form);

      alert("Consultation Booked Successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        service: "",
        message: "",
      });
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* TITLE */}
        <h1 className="text-5xl font-bold text-yellow-400 mb-4">
          Free Legal Consultation
        </h1>

        <p className="text-gray-400 mb-12 text-lg">
          Schedule a confidential consultation with our experienced legal team.
          Choose your preferred date and time and briefly describe your issue.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT INFO */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">
              Why Choose Us?
            </h2>

            <div className="space-y-5 text-gray-300">
              <div>
                <h3 className="font-semibold text-white">
                  Experienced Attorneys
                </h3>
                <p>
                  Professional legal experts with years of courtroom experience.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Confidential Discussion
                </h3>
                <p>
                  Your personal information and legal matters remain secure.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Flexible Scheduling
                </h3>
                <p>Choose the most convenient consultation time for you.</p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Affordable Solutions
                </h3>
                <p>Practical legal guidance tailored to your situation.</p>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 p-8 rounded-2xl border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">
              Book Appointment
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 mb-4 bg-slate-800 rounded"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 mb-4 bg-slate-800 rounded"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 mb-4 bg-slate-800 rounded"
              required
            />

            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full p-3 mb-4 bg-slate-800 rounded"
              required
            >
              <option value="">Select Legal Service</option>
              <option>Corporate Law</option>
              <option>Criminal Law</option>
              <option>Family Law</option>
              <option>Property Law</option>
              <option>Business Consultation</option>
            </select>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full p-3 bg-slate-800 rounded"
                required
              />

              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full p-3 bg-slate-800 rounded"
                required
              />
            </div>

            <textarea
              name="message"
              placeholder="Describe your legal issue..."
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 mb-5 bg-slate-800 rounded"
            />

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              Book Free Consultation
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Consultation;
