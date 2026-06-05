import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        window.location.href = "/admin";
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-8 rounded-2xl w-[400px] border border-white/10"
      >
        <h1 className="text-3xl text-yellow-400 mb-6 font-bold text-center">
          Admin Login
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-slate-800 text-white rounded outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-slate-800 text-white rounded outline-none"
        />

        {/* BUTTON (IMPORTANT FIX) */}
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black py-3 rounded font-semibold hover:scale-105 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
