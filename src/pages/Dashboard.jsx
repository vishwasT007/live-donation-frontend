import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    const fetchRecent = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/report/recent`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRecent(res.data);
      } catch (err) {
        console.error("Failed to fetch recent donations", err);
      }
    };

    fetchStats();
    fetchRecent();
  }, [user.token, API_BASE]);

  const exportExcel = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/report/export`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        responseType: "blob", // 👈 Important for file download
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mandal_donations.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
      alert("❌ Export failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">📊 Dashboard</h1>

        {stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded shadow">
              <h2 className="text-sm text-gray-600">Total Collection</h2>
              <p className="text-xl font-bold text-blue-700">
                ₹{stats.totalCollection}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded shadow">
              <h2 className="text-sm text-gray-600">Total Donors</h2>
              <p className="text-xl font-bold text-green-700">
                {stats.totalDonors}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded shadow">
              <h2 className="text-sm text-gray-600">Today's Collection</h2>
              <p className="text-xl font-bold text-yellow-700">
                ₹{stats.todayCollection}
              </p>
            </div>
            <div className="bg-pink-100 p-4 rounded shadow">
              <h2 className="text-sm text-gray-600">Today's Donors</h2>
              <p className="text-xl font-bold text-pink-700">
                {stats.todayDonors}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading stats...</p>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">🧾 Recent Donations</h2>
          <button
            onClick={exportExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow border">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Name</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Mode</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((donation) => (
                <tr key={donation._id} className="border-t text-sm">
                  <td className="p-2">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">{donation.fullName}</td>
                  <td className="p-2">₹{donation.amount}</td>
                  <td className="p-2">{donation.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
