import { useState } from "react";
import { signupUser } from "../api/api";

export default function SignUp({ onSignup, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    address: "",
    AadharCardNumber: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ---- Required field validation ----
    if (!form.name || !form.age || !form.address || !form.AadharCardNumber || !form.password) {
      setError("Please fill all required fields");
      return;
    }

    // Aadhaar validation
    if (!/^\d{12}$/.test(form.AadharCardNumber)) {
      setError("Enter a valid 12-digit Aadhaar number");
      return;
    }

    try {
      const res = await signupUser({
        ...form,
        age: Number(form.age),
        mobile: form.mobile ? Number(form.mobile) : undefined,
        AadharCardNumber: Number(form.AadharCardNumber)
      });

      console.log("Signup response:", res);

      // Pass token to App.jsx
      if (onSignup) onSignup({ token: res.token, AadharCardNumber: form.AadharCardNumber });

    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

return (
  <div className="min-h-screen bg-emerald-100 eci-watermark flex items-center justify-center px-4">
    <div className="relative z-10 bg-white rounded-xl shadow-lg max-w-md w-full p-8">

      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Create Account
      </h2>

      {error && (
        <p className="text-red-600 mb-3 text-center text-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="name"
          placeholder="Full Name *"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <input
          name="age"
          type="number"
          placeholder="Age *"
          value={form.age}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <input
          name="email"
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <input
          name="mobile"
          type="number"
          placeholder="Mobile (optional)"
          value={form.mobile}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <input
          name="address"
          placeholder="Address *"
          value={form.address}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <input
          name="AadharCardNumber"
          placeholder="12-digit Aadhaar *"
          value={form.AadharCardNumber}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password *"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          className="text-emerald-600 font-medium hover:underline"
          onClick={onSwitchToLogin}
        >
          Login
        </button>
      </p>

    </div>
  </div>
);

}
