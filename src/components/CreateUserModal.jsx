import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CreateUserModal = ({ onClose, onUserCreated }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/register", form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      onUserCreated(); // Refresh the user list
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create New User</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
