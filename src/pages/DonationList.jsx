import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const DonationList = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    donationId: null,
    donationName: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const fetchDonations = async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get("http://localhost:4000/api/donations", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.error("Failed to load donations:", err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [user]);

  const openDeleteConfirmation = (id, name) => {
    setDeleteConfirmation({
      isOpen: true,
      donationId: id,
      donationName: name,
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      donationId: null,
      donationName: "",
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.donationId) return;
    try {
      await axios.delete(
        `http://localhost:4000/api/donations/${deleteConfirmation.donationId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setDonations((prev) =>
        prev.filter((d) => d._id !== deleteConfirmation.donationId)
      );
      closeDeleteConfirmation();
      setSuccessMessage("Donation deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:4000/api/donations/${editingDonation._id}`,
        editingDonation,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setDonations(
        donations.map((d) => (d._id === editingDonation._id ? res.data : d))
      );
      setEditingDonation(null);
      setSuccessMessage("Donation updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDonation({
      ...editingDonation,
      [name]: value,
    });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center sm:text-left mb-6">
          🧾 All Donations
        </h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {donations.length === 0 ? (
          <div className="bg-white text-center text-gray-600 p-6 rounded-lg shadow">
            No donations found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">UTR</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{d.fullName}</td>
                    <td className="px-4 py-3">₹{d.amount}</td>
                    <td className="px-4 py-3">{d.paymentMode}</td>
                    <td className="px-4 py-3">{d.mobileNumber}</td>
                    <td className="px-4 py-3">{d.address || "-"}</td>
                    <td className="px-4 py-3">{d.upiUtrNumber || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setEditingDonation({ ...d })}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            openDeleteConfirmation(d._id, d.fullName)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🗑️ Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-3xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete donation from{" "}
              <strong>{deleteConfirmation.donationName}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteConfirmation}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ Edit Donation Modal */}
      {editingDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-3xl mb-4">✏️</div>
            <h3 className="text-lg font-bold mb-4">Edit Donation</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editingDonation.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={editingDonation.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    name="paymentMode"
                    value={editingDonation.paymentMode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select payment mode</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={editingDonation.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={editingDonation.address || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UTR Number
                  </label>
                  <input
                    type="text"
                    name="upiUtrNumber"
                    value={editingDonation.upiUtrNumber || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingDonation(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationList;
