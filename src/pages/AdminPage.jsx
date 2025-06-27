import { useState } from "react";
import UserList from "../components/UserList";
import CreateUserModal from "../components/CreateUserModal";
import DonationList from "./DonationList";
import Navbar from "../components/Navbar";

const AdminPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // To trigger user list refresh

  const handleUserCreated = () => {
    setRefreshKey((prev) => prev + 1); // force reload
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-10 pt-15">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
          {/* Header + Create Button */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">👑 Admin Panel</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              ➕ Create User
            </button>
          </div>

          {/* Users List */}
          <div>
            {/* <h2 className="text-xl font-semibold text-gray-700 mb-2">
            User List
          </h2> */}
            <UserList key={refreshKey} />
          </div>

          {/* Donations List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Recent Donations
            </h2>
            <DonationList />
          </div>
        </div>

        {/* Create User Modal */}
        {showModal && (
          <CreateUserModal
            onClose={() => setShowModal(false)}
            onUserCreated={handleUserCreated}
          />
        )}
      </div>
    </>
  );
};

export default AdminPage;
