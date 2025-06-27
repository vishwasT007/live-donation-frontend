import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DonationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: null,
    amount: null,
    paymentMode: "",
    upiUtrNumber: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Convert mobileNumber to number and validate
      const mobileNum = Number(form.mobileNumber);
      if (isNaN(mobileNum) || !/^\d{10}$/.test(String(mobileNum))) {
        setError("Mobile number must be 10 digits.");
        setIsLoading(false);
        return;
      }

      // Convert amount to float and validate
      const amountNum = parseFloat(form.amount);
      if (isNaN(amountNum)) {
        setError("Please enter a valid donation amount.");
        setIsLoading(false);
        return;
      }

      // Prepare data with proper number types
      const donationData = {
        ...form,
        mobileNumber: mobileNum,
        amount: amountNum,
      };

      const res = await axios.post(
        "http://localhost:4000/api/donations/add",
        donationData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSuccessMessage("Donation saved successfully!");
      setForm({
        fullName: "",
        mobileNumber: null,
        amount: null,
        paymentMode: "",
        upiUtrNumber: "",
        address: "",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(
        "Failed to save donation: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and convert to number type
    if (value === "") {
      setForm({ ...form, [name]: null });
    } else if (/^\d*\.?\d*$/.test(value)) {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
            Make Your Chanda (Donation)
          </h2>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {successMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> {successMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="tel"
                pattern="[0-9]{10}"
                placeholder="10-digit Mobile Number"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={form.mobileNumber || ""}
                onChange={handleNumberChange}
                name="mobileNumber"
                required
              />
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Donation Amount
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Donation Amount (₹)"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={form.amount || ""}
                onChange={handleNumberChange}
                name="amount"
                required
                min="1"
              />
            </div>
            <div>
              <label
                htmlFor="paymentMode"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Payment Mode
              </label>
              <select
                id="paymentMode"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={form.paymentMode}
                onChange={(e) =>
                  setForm({ ...form, paymentMode: e.target.value })
                }
                required
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {form.paymentMode === "UPI" && (
              <div>
                <label
                  htmlFor="upiUtrNumber"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  UPI UTR Number
                </label>
                <input
                  id="upiUtrNumber"
                  type="text"
                  placeholder="UPI UTR Number (Optional)"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={form.upiUtrNumber}
                  onChange={(e) =>
                    setForm({ ...form, upiUtrNumber: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Address
              </label>
              <textarea
                id="address"
                placeholder="Address (Optional)"
                rows="3"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Donation"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DonationForm;
