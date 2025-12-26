export default function VoteResults({ results }) {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="font-semibold text-lg mb-2">Results</h2>
      {results.map(r => (
        <div key={r.id} className="mb-2">
          <p className="font-medium">{r.name} ({r.party}): {r.votes}</p>
          <div className="bg-gray-200 h-2 rounded">
            <div
              className="h-2 rounded"
              style={{ width: `${(r.votes / 100) * 100}%`, backgroundColor: r.color || "#3b82f6" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
