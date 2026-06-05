import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-b from-slate-950 to-slate-900 text-white px-6 md:px-16">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12 md:gap-20">
        {/* LEFT CONTENT */}
        <div className="max-w-xl">
          <p className="text-yellow-400 tracking-widest uppercase text-xs md:text-sm mb-4">
            Trusted Legal Experts
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Defending Your Rights With Integrity & Experience
          </h1>

          <p className="mt-6 text-gray-400 leading-relaxed text-sm md:text-base">
            We provide expert legal services in corporate law, criminal defense,
            family disputes, and business consultation with 20+ years of
            experience.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              Get Consultation
            </button>

            <button
              onClick={() => navigate("/about")}
              className="border border-white/30 px-6 py-3 rounded-full hover:border-yellow-400 hover:text-yellow-400 transition"
            >
              Learn More
            </button>
          </div>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <p className="text-white text-xl font-bold">20+</p>
              <p className="text-gray-400 text-xs md:text-sm">
                Years Experience
              </p>
            </div>

            <div>
              <p className="text-white text-xl font-bold">1500+</p>
              <p className="text-gray-400 text-xs md:text-sm">Cases Won</p>
            </div>

            <div>
              <p className="text-white text-xl font-bold">98%</p>
              <p className="text-gray-400 text-xs md:text-sm">Success Rate</p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800"
            alt="law firm"
            className="w-[320px] md:w-[400px] rounded-2xl shadow-2xl object-cover"
          />

          {/* floating card */}
          <div className="absolute -bottom-4 -left-4 bg-slate-800 p-4 rounded-xl shadow-lg border border-white/10">
            <p className="text-yellow-400 font-bold text-sm">24/7 Support</p>
            <p className="text-xs text-gray-300">
              Always available for clients
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
