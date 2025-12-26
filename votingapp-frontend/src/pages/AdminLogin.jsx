import { useState } from "react";
import { loginUser } from "../api/api";

export default function AdminLogin({ onAdminLogin, onSwitchToAdminSignup }) {
  const [AadharCardNumber, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ AadharCardNumber, password });
      console.log(res);
      
      if (res.role !== "admin") {
        setError("This account is not an admin");
        return;
      }
      onAdminLogin(res);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

return (
 <div className="min-h-screen bg-emerald-100 eci-watermark flex items-center justify-center px-4">
  <div className="relative z-10 bg-white rounded-xl shadow-lg max-w-md w-full p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Admin Login
      </h2>

      <p className="text-center text-sm text-gray-500 mb-6">
        Election Commission – Authorized Access
      </p>

      {error && (
        <p className="text-red-600 text-sm mb-3 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-sm text-gray-600">Aadhaar Number</label>
          <input
            value={AadharCardNumber}
            onChange={(e) => setAadhar(e.target.value.trim())}
            placeholder="12-digit Aadhaar"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700 transition"
        >
          Login as Admin
        </button>
      </form>

      
    </div>
  </div>
);

}
