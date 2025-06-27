import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DonationForm from "./pages/DonationForm";
import PrivateRoute from "./components/PrivateRoute";
import DonationList from "./pages/DonationList";
import AdminRoute from "./routes/AdminRoute";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/donate"
          element={
            <PrivateRoute>
              <DonationForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/donations"
          element={
            <PrivateRoute>
              <DonationList />
            </PrivateRoute>
          }
        />

        {/* 🔐 Protect this route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
