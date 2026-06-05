import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-slate-950 text-white border-b border-white/10 sticky top-0 backdrop-blur-md z-50">
      {/* Logo */}
      <h2 className="text-yellow-400 font-bold text-2xl tracking-wide">
        Justice & Partners
      </h2>

      {/* Links */}
      <ul className="flex gap-10 text-sm text-gray-300">
        <li>
          <Link to="/" className="hover:text-yellow-400 transition">
            Home
          </Link>
        </li>

        <li>
          <Link to="/about" className="hover:text-yellow-400 transition">
            About
          </Link>
        </li>

        <li>
          <Link to="/services" className="hover:text-yellow-400 transition">
            Services
          </Link>
        </li>

        <li>
          <Link to="/contact" className="hover:text-yellow-400 transition">
            Contact
          </Link>
        </li>
      </ul>

      {/* Button */}
      <button
        onClick={() => navigate("/consultation")}
        className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold hover:scale-105 transition"
      >
        Free Consultation
      </button>
    </nav>
  );
}

export default Navbar;
