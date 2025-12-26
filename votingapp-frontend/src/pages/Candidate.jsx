import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from "../api/api";

export default function AdminDashboard() {
  const location = useLocation();
  const token = location.state?.token;

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    age: "",
    address: "",
  });

  // ================= FETCH CANDIDATES =================
  const fetchCandidates = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await getCandidates(token);

      if (data?.candidates && Array.isArray(data.candidates)) {
        setCandidates(data.candidates);
      } else {
        setCandidates([]);
        console.error("Invalid response:", data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // ================= FORM HANDLER =================
  const handleInputChange = (e) => {
    setNewCandidate({
      ...newCandidate,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, party, age, address } = newCandidate;

    if (!name || !party || !age || !address) {
      setError("All fields are required");
      return;
    }

    try {
      if (editingId) {
        await updateCandidate(editingId, newCandidate, token);
        alert("Candidate updated successfully");
        setEditingId(null);
      } else {
        await createCandidate(newCandidate, token);
        alert("Candidate created successfully");
      }

      setNewCandidate({ name: "", party: "", age: "", address: "" });
      fetchCandidates();
    } catch (err) {
      console.error(err);
      setError("Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (candidate) => {
    setNewCandidate({
      name: candidate.name,
      party: candidate.party,
      age: candidate.age,
      address: candidate.address,
    });
    setEditingId(candidate._id);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;

    try {
      await deleteCandidate(id, token);
      alert("Candidate deleted");
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading candidates...</p>;
  }

  return (
    <div className="min-h-screen bg-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-5xl w-full rounded-xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-center">Administration Control</h1>
        <p className="text-center text-gray-500 mb-6">
          Election Commission – Candidate Management
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-3">
            {editingId ? "Edit Candidate" : "Create Candidate"}
          </h2>

          {error && <p className="text-red-600 mb-2">{error}</p>}

          <div className="grid md:grid-cols-2 gap-3">
            <input
              name="name"
              placeholder="Name"
              value={newCandidate.name}
              onChange={handleInputChange}
              className="input"
            />
            <input
              name="party"
              placeholder="Party"
              value={newCandidate.party}
              onChange={handleInputChange}
              className="input"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={newCandidate.age}
              onChange={handleInputChange}
              className="input"
            />
            <input
              name="address"
              placeholder="Address"
              value={newCandidate.address}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <button className="mt-4 w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800">
            {editingId ? "Update Candidate" : "Create Candidate"}
          </button>
        </form>

        {/* CANDIDATE LIST */}
        <h2 className="text-xl font-semibold mb-3">Existing Candidates</h2>

        {Array.isArray(candidates) && candidates.length === 0 && (
          <p className="text-gray-500">No candidates available.</p>
        )}

        {Array.isArray(candidates) &&
          candidates.map((c) => (
            <div
              key={c._id}
              className="flex justify-between items-start bg-gray-50 p-4 mb-3 rounded"
            >
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p>Party: {c.party}</p>
                <p>Age: {c.age}</p>
                <p>Address: {c.address}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
