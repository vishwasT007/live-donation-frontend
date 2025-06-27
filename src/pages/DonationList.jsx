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

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center sm:text-left mb-6">
          🧾 All Donations
        </h1>

        {successMessage && <div className="custom-toast">{successMessage}</div>}

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
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">🗑️</div>
            <div className="modal-title">Confirm Deletion</div>
            <div className="modal-message">
              Are you sure you want to delete donation from{" "}
              <strong>{deleteConfirmation.donationName}</strong>? This action
              cannot be undone.
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
    </>
  );
};

export default DonationList;
