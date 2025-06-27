import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";

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
      const res = await axios.get("/api/auth/users", {
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
      await axios.delete(`/api/auth/users/${deleteConfirmation.userId}`, {
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
        `/api/auth/users/${editUser._id}`,
        { name: editUser.name, role: editUser.role },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
    }
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
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => setEditUser(u)}
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button onClick={() => setEditUser(null)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">🗑️</div>
            <div className="modal-title">Confirm Deletion</div>
            <div className="modal-message">
              Are you sure you want to delete user{" "}
              <strong>{deleteConfirmation.userName}</strong>?
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeDeleteConfirmation}>
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDelete}>
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
