import { useState } from "react";
import { loginUser } from "../../services/authService";
import { Eye, EyeOff, Wallet } from "lucide-react"; // ✅ added Wallet

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form);
      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700"></div>

      {/* ✅ LOGO CENTER TOP */}
      <div className="relative flex items-center gap-2 mb-6 text-white">
        <Wallet size={36} />
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
      </div>

      {/* LOGIN CARD */}
      <div className="relative bg-white p-10 rounded-2xl shadow-2xl w-[400px]">

        <h2 className="text-3xl font-bold text-center text-purple-900 mb-8">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="email"
            placeholder="Username"
            className="p-3 rounded-full bg-gray-100 outline-none"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-3 rounded-full bg-gray-100 outline-none w-full pr-10"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button className="bg-purple-900 text-white py-3 rounded-full hover:bg-purple-800 transition">
            Login
          </button>

        </form>

        <p className="text-center text-sm mt-6 text-purple-700">
          Don’t Have an Account?{" "}
          <a href="/register" className="font-semibold">
            Sign Up
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;