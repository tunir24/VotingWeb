import { useState } from "react";
import { loginUser } from "../api/api";

export default function Login({ onLogin, onSwitchToSignup }) {
  const [AadharCardNumber, setAadharCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{12}$/.test(AadharCardNumber)) {
      setError("Enter a valid 12-digit Aadhaar number");
      return;
    }

    try {
      const res = await loginUser({ AadharCardNumber, password });
      console.log("Login response:", res);
      if (onLogin) onLogin({ token: res.token, AadharCardNumber });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

return (
  <div className="min-h-screen bg-emerald-100 flex items-center justify-center px-4">
    <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg grid md:grid-cols-2 overflow-hidden">

      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center p-10 bg-gray-50">
        <h1 className="text-4xl font-bold text-emerald-700 text-center leading-snug">
  Welcome to Secure Voting Portal
</h1>


        <p className="text-gray-600 mb-6">
          An Unofficial digital voting platform inspired by the
          Election Commission of India.
        </p>

        <ul className="space-y-3 text-gray-700 text-sm">
          <li>✔ Aadhaar-based secure authentication</li>
          <li>✔ One voter, one vote system</li>
          <li>✔ Real-time & transparent results</li>
          <li>✔ Government-grade data security</li>
        </ul>
      </div>

      {/* RIGHT PANEL – LOGIN */}
      <div className="p-8 md:p-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Voter Login
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Aadhaar Number
            </label>
            <input
              type="text"
              placeholder="Enter 12-digit Aadhaar"
              value={AadharCardNumber}
              onChange={(e) => setAadharCardNumber(e.target.value.trim())}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-emerald-600 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  </div>
);
}
