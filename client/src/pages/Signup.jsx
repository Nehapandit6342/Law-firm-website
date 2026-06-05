import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const isWeakPassword = password.length > 0 && password.length < 6;
  async function handleSignup(e) {
    e.preventDefault();
    if (!email || !password) {
      alert("please fill all fields");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/admin/signup", {
        email,
        password,
      });

      if (res.data.success) {
        alert("Admin created successfully");
        navigate("/login");
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-2">
          Admin Signup
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          Create your admin account to manage system
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 bg-slate-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {isWeakPassword && (
              <p className="text-red-400 text-xs mt-1">
                Password should be at least 6 characters
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
