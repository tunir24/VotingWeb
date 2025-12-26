export default function CandidateCard({ candidate, onVote }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-2">
      <div className="flex items-center gap-4">
        <img alt={candidate.name} className="w-12 h-12 rounded-full"/>
        <div>
          <p className="font-semibold">{candidate.name}</p>
          <p className="text-sm text-gray-500">{candidate.party}</p>
        </div>
      </div>
      <button
        onClick={() => onVote(candidate.id)}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Vote
      </button>
    </div>
  );
}
