import { useEffect, useState } from "react";
import { getResults } from "../api/api";

export default function Results() {
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
    try {
      const data = await getResults();

      const totalVotes = data.reduce(
        (sum, c) => sum + (c.count || 0),
        0
      );

      const withPercentages = data.map(c => {
        const pct = totalVotes
          ? ((c.count / totalVotes) * 100).toFixed(2)
          : 0;

        return { ...c, percentage: pct };
      });

      setResults(withPercentages);
    } catch (err) {
      console.error("Error fetching results", err);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

 return (
  <div className="min-h-screen bg-emerald-100 eci-watermark flex items-center justify-center px-4">
    <div className="relative z-10 bg-white max-w-4xl w-full rounded-xl shadow-lg p-6">

      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Election Results
      </h1>

      {results.map(r => (
        <div
          key={r._id}
          className="bg-gray-50 rounded-lg border p-4 mb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-semibold text-gray-800">
                {r.name}
              </p>
              <p className="text-sm text-gray-500">
                Party: {r.party}
              </p>
            </div>

            <p className="font-bold text-gray-700">
              {r.count} votes
            </p>
          </div>

          <div className="bg-gray-200 h-3 rounded">
            <div
              className="h-3 rounded bg-emerald-600 transition-all"
              style={{ width: `${r.percentage}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {r.percentage}% vote share
          </p>
        </div>
      ))}

    </div>
  </div>
);


}
