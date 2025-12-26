import { useState, useEffect, useCallback } from "react";
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from "../api/api";

export default function AdminDashboard({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    age: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // candidate being edited

  // Fetch candidates
  const fetchCandidates = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getCandidates(token);
      setCandidates(data);
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

  const handleInputChange = (e) => {
    setNewCandidate((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Create or Update candidate
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
        alert("Candidate updated successfully!");
        setEditingId(null);
      } else {
        await createCandidate(newCandidate, token);
        alert("Candidate created successfully!");
      }

      setNewCandidate({ name: "", party: "", age: "", address: "" });
      fetchCandidates();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save candidate");
    }
  };

  // Edit candidate
  const handleEdit = (candidate) => {
    setNewCandidate({
      name: candidate.name,
      party: candidate.party,
      age: candidate.age,
      address: candidate.address,
    });
    setEditingId(candidate._id);
  };

  // Delete candidate
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await deleteCandidate(id, token);
      alert("Candidate deleted successfully");
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete candidate");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading candidates…</p>;

return (
  <div className="min-h-screen bg-emerald-100 eci-watermark flex items-center justify-center px-4">
    <div className="relative z-10 bg-white max-w-5xl w-full rounded-xl shadow-lg p-6">

      <h1 className="text-2xl font-bold mb-1 text-center text-gray-800">
        Adminstration Control
      </h1>
      <p className="text-center text-sm text-gray-500 mb-6">
        Election Commission – Candidate Management Panel
      </p>

      {/* Create / Edit Candidate Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-4 rounded-lg border mb-6"
      >
        <h2 className="font-semibold mb-3 text-gray-700">
          {editingId ? "Edit Candidate" : "Create Candidate"}
        </h2>

        {error && (
          <p className="text-red-600 mb-2 text-sm">
            {error}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            name="name"
            placeholder="Candidate Name"
            value={newCandidate.name}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          <input
            type="text"
            name="party"
            placeholder="Party Name"
            value={newCandidate.party}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newCandidate.age}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newCandidate.address}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-purple-700 text-white py-2 rounded-lg font-medium hover:bg-purple-800 transition"
        >
          {editingId ? "Update Candidate" : "Create Candidate"}
        </button>
      </form>

      {/* Existing Candidates */}
      <h2 className="text-xl font-semibold mb-3 text-gray-700">
        Existing Candidates
      </h2>

      {!candidates.length && (
        <p className="text-gray-500 text-sm">
          No candidates available.
        </p>
      )}

      {candidates.map((c) => (
        <div
          key={c._id}
          className="flex justify-between items-start md:items-center p-4 mb-3 bg-gray-50 rounded-lg border"
        >
          <div>
            <h3 className="font-semibold text-gray-800">
              {c.name}
            </h3>
            <p className="text-sm text-gray-600">Party: {c.party}</p>
            <p className="text-sm text-gray-600">Age: {c.age}</p>
            <p className="text-sm text-gray-600">Address: {c.address}</p>
          </div>

          <div className="flex gap-2 mt-3 md:mt-0">
            <button
              onClick={() => handleEdit(c)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(c._id)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
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
