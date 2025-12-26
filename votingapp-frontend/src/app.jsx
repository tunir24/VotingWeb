import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Voting from "./pages/Voting";
import Results from "./pages/Results";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ---------------------------
  // VOTER AUTH
  // ---------------------------
  const handleLogin = (data) => {
    setUser(data);
    localStorage.setItem("token", data.token);

    // redirect to /voting
    navigate("/voting");
  };

  const handleSignup = (data) => {
    setUser(data);
    localStorage.setItem("token", data.token);

    navigate("/voting");
  };

  // ---------------------------
  // ADMIN LOGIN
  // ---------------------------
  const handleAdminLogin = (admin) => {
    if (admin.role !== "admin") {
      alert("Access denied — Not an admin");
      return;
    }

    setUser(admin);
    localStorage.setItem("token", admin.token);

    // redirect to admin dashboard
    navigate("/admin/dashboard");
  };

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>

        {/* Landing */}
        <Route
  path="/"
  element={
    <div className="min-h-screen bg-emerald-100 eci-watermark flex items-center justify-center px-4">
      <div className="relative z-10 bg-white max-w-4xl w-full rounded-xl shadow-lg p-8 grid md:grid-cols-2 gap-6">

        {/* LEFT: INFO */}
        <div>
          <h1 className="text-3xl font-bold text-emerald-700 mb-4">
            Secure Voting Portal
          </h1>

          <p className="text-gray-600 mb-4">
            An Unofficial prototype inspired by the Election Commission of India
            to ensure transparent, secure, and fair elections through
            digital governance.
          </p>

          <ul className="text-sm text-gray-700 space-y-2">
            <li>✔ Aadhaar-based voter authentication</li>
            <li>✔ One voter, one vote enforcement</li>
            <li>✔ Tamper-resistant voting mechanism</li>
            <li>✔ Real-time vote counting & results</li>
          </ul>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex flex-col justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Voter Login
          </button>

          <button
            onClick={() => navigate("/admin/login")}
            className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700 transition"
          >
            Admin Login
          </button>
        </div>

      </div>
    </div>
  }
/>


        {/* Voter routes */}
        <Route path="/login" element={
          <Login onLogin={handleLogin} onSwitchToSignup={() => navigate("/signup")} />
        }/>

        <Route path="/signup" element={
          <SignUp onSignup={handleSignup} onSwitchToLogin={() => navigate("/login")} />
        }/>

        <Route path="/voting" element={
          token ? (
            <Voting token={token} onShowResults={() => navigate("/results")} />
          ) : (
            <Navigate to="/login" replace />
          )
        }/>

        <Route path="/results" element={
          token ? <Results token={token} /> : <Navigate to="/login" replace />
        }/>

        {/* Admin routes */}
        <Route path="/admin/login" element={
          <AdminLogin onAdminLogin={handleAdminLogin} />
        }/>

        <Route path="/admin/dashboard" element={
          token ? (
            <AdminDashboard token={token} />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }/>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </div>
  );
}
