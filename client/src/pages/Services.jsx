import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

function Services() {
  const [services, setServices] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await axios.get("http://localhost:5000/services");

      setServices(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleClick = (service) => {
    navigate(`/service/${service.id}`);
  };

  return (
    <section className="px-10 py-20 bg-slate-950 text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">
        Our Legal Services
      </h1>

      <p className="text-gray-400 max-w-2xl mb-12">
        We provide expert legal solutions across multiple practice areas.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleClick(service)}
            className="p-6 bg-slate-800 rounded-xl border border-white/10 hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-xl font-bold text-yellow-400 mb-3">
              {service.title}
            </h2>

            <p className="text-gray-400 text-sm">{service.short_description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
