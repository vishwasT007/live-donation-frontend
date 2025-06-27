import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";

const API = import.meta.env.VITE_API_BASE_URL;

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteConfirmation = (id, name) => {
    setDeleteConfirmation({ isOpen: true, userId: id, userName: name });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, userId: null, userName: "" });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/api/auth/users/${deleteConfirmation.userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchUsers();
      closeDeleteConfirmation();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API}/api/auth/users/${editUser._id}`,
        { name: editUser.name, role: editUser.role },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const startEditing = (user) => {
    setEditUser({ ...user });
  };

  const cancelEditing = () => {
    setEditUser(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {editUser?._id === u._id ? (
                      <input
                        type="text"
                        value={editUser.name}
                        onChange={(e) =>
                          setEditUser({ ...editUser, name: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      u.name
                    )}
                  </td>
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2 capitalize">
                    {editUser?._id === u._id ? (
                      <select
                        value={editUser.role}
                        onChange={(e) =>
                          setEditUser({ ...editUser, role: e.target.value })
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {editUser?._id === u._id ? (
                      <>
                        <button
                          onClick={handleEditSubmit}
                          className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                          title="Save"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                          title="Cancel"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(u)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmation(u._id, u.name)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-center text-4xl mb-4">🗑️</div>
            <h3 className="text-xl font-bold text-center mb-2">
              Confirm Deletion
            </h3>
            <p className="text-center mb-6">
              Are you sure you want to delete user{" "}
              <strong>{deleteConfirmation.userName}</strong>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={closeDeleteConfirmation}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
