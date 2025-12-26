import { useEffect, useState } from "react";
const BASE_URL = process.env.REACT_APP_API_URL;

export default function Voting({ token, onShowResults }) {
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`${BASE_URL}/candidate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Error fetching candidates");
      });
  }, [token]);

  const handleVote = async (candidateId) => {
    if (!token) return;

    try {
      const res = await fetch(
        `${BASE_URL}/vote/${candidateId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert("Vote successful!");
        setVoted(true);
      } else {
        alert(result.message || "Voting failed");
      }
    } catch {
      alert("Error while voting");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading candidates...</p>;

  if (!candidates.length)
    return <p className="text-center mt-10">No candidates available.</p>;

 return (
  <div className="min-h-screen bg-emerald-100 eci-watermark flex items-center justify-center px-4">
    <div className="relative z-10 bg-white max-w-3xl w-full rounded-xl shadow-lg p-6">

      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Cast Your Vote
      </h1>

      {candidates.map((c) => (
        <div
          key={c._id}
          className="flex justify-between items-center p-4 mb-4 border rounded-lg bg-gray-50"
        >
          <div>
            <h2 className="font-semibold text-lg text-gray-800">
              {c.name}
            </h2>
            <span className="inline-block mt-1 text-sm px-3 py-1 rounded-full bg-red-200 text-black-1000 ">
              {c.party}
            </span>
          </div>

          <button
            onClick={() => handleVote(c._id)}
            disabled={voted}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              voted
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {voted ? "Vote Cast" : "Vote"}
          </button>
        </div>
      ))}

      {/* View Results */}
      {voted && (
        <div className="text-center mt-6">
          <button
            className="px-6 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
            onClick={onShowResults}
          >
            View Election Results
          </button>
        </div>
      )}
    </div>
  </div>
);

}
