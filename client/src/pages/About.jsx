import { useEffect, useState } from "react";
import axios from "axios";

function About() {
  const [team, setTeam] = useState([]);

  // FETCH TEAM FROM BACKEND
  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      const res = await axios.get("http://localhost:5000/team");
      setTeam(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className="px-10 py-20 bg-slate-900 text-white">
      {/* TITLE */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">
        About Our Law Firm
      </h1>

      <p className="text-gray-300 max-w-3xl mb-12 leading-relaxed">
        We are a professional law firm committed to delivering justice with
        integrity, experience, and dedication. Our team has successfully handled
        hundreds of cases across criminal, family, and corporate law.
      </p>

      {/* ================= TEAM SECTION ================= */}
      <h2 className="text-3xl font-semibold text-white mb-8">Meet Our Team</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {team.length > 0 ? (
          team.map((member) => (
            <div
              key={member.id}
              className="bg-slate-800 p-6 rounded-xl border border-white/10 hover:scale-105 transition"
            >
              <img
                src={`http://localhost:5000${member.image}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
                alt={member.name}
              />
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-gray-400 text-sm">{member.role}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No team members found</p>
        )}
      </div>

      {/* ================= TIMELINE SECTION ================= */}
      <h2 className="text-3xl font-semibold text-white mb-8">Our Journey</h2>

      <div className="border-l-2 border-yellow-400 pl-6 space-y-8">
        <div>
          <h3 className="text-xl font-bold">2005 - Foundation</h3>
          <p className="text-gray-400">
            The firm was established with a vision to provide justice-driven
            legal services.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold">2010 - Expansion</h3>
          <p className="text-gray-400">
            Expanded to corporate and family law, handling major cases across
            Nepal.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold">2018 - Recognition</h3>
          <p className="text-gray-400">
            Recognized as one of the most trusted law firms with 90%+ success
            rate.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold">2025 - Today</h3>
          <p className="text-gray-400">
            Serving thousands of clients with a strong team of experienced
            lawyers.
          </p>
        </div>
      </div>
      {/* ================= LOCATION SECTION ================= */}
      <h2 className="text-3xl font-semibold text-white mb-6 mt-16">
        Visit Our Office
      </h2>

      <p className="text-gray-400 mb-6 max-w-2xl">
        We are located in Koteshwor, Kathmandu. Feel free to visit us for legal
        consultation and support.
      </p>

      <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10">
        <iframe
          src="https://www.google.com/maps?q=Koteshwor,Kathmandu&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

export default About;
