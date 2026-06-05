import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);

  useEffect(() => {
    fetchService();
  }, []);

  async function fetchService() {
    try {
      const res = await axios.get("http://localhost:5000/services");
      const found = res.data.find((s) => s.id === parseInt(id));
      setService(found);
    } catch (err) {
      console.log(err);
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white px-10 py-20">
      {/* TITLE */}
      <h1 className="text-5xl font-bold text-yellow-400 mb-6">
        {service.title}
      </h1>

      {/* SHORT DESC */}
      <p className="text-gray-400 text-lg mb-8">{service.short_description}</p>

      {/* LONG DESC */}
      <div className="bg-slate-900 p-8 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400"></h2>

        <p className="text-gray-300 leading-8 whitespace-pre-line">
          {service.long_description}
        </p>
      </div>

      {/* CONTACT BUTTON */}
      <button
        onClick={() => navigate(`/contact?service=${service.title}`)}
        className="mt-10 bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
      >
        Contact About This Service
      </button>
    </section>
  );
}

export default ServiceDetails;
