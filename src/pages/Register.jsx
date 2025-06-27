import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Base URL from environment variable or fallback
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        ...form,
      });
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      alert(
        "Register failed: " + (err.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
        <p className="text-center mt-3">
          Already registered?{" "}
          <a href="/" className="text-blue-500">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
