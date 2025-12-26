import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const token = localStorage.getItem("token");

  // 🚫 no token = redirect to login
  if (!token) return <Navigate to="/" replace />;

  useEffect(() => {
    fetch("http://localhost:5000/candidates", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => setCandidates(data))
      .catch(() => alert("Error loading candidates"));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">See Candidates</h1>

      {candidates.map(c => (
        <div key={c._id} className="p-3 border rounded mb-2">
          <h2 className="font-semibold">{c.name}</h2>
          <p>Party: {c.party}</p>
        </div>
      ))}

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}
