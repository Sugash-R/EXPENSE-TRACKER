import { useState } from "react";
import { registerUser } from "../../services/authService";
import { Eye, EyeOff, Wallet } from "lucide-react"; // ✅ added Wallet

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);

      setError("");
      setSuccess("✅ Registration Successful! You can now login.");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err) {
      setSuccess("");
      setError(err.response?.data?.message || "Registration failed");
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

      {/* CARD */}
      <div className="relative bg-white p-10 rounded-2xl shadow-2xl w-[400px]">

        <h2 className="text-3xl font-bold text-center text-purple-900 mb-8">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="p-3 rounded-full bg-gray-100 outline-none"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 rounded-full bg-gray-100 outline-none"
            onChange={handleChange}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="p-3 rounded-full bg-gray-100 outline-none w-full pr-10"
              onChange={handleChange}
            />

            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button className="bg-purple-900 text-white py-3 rounded-full hover:bg-purple-800 transition">
            Register
          </button>

        </form>

        {success && (
          <p className="text-green-600 text-sm text-center mt-4 font-medium">
            {success}
          </p>
        )}

        <p className="text-center text-sm mt-6 text-purple-700">
          Already have an account?{" "}
          <a href="/login" className="font-semibold">
            Login
          </a>
        </p>

      </div>
    </div>
  );
};

export default Register;