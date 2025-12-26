export default function Navbar({ user, onLogout }) {
  return (
    <div className="bg-sky-200 shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
    
    <div className="flex items-center gap-3">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg"
        alt="ECI"
        className="w-8 h-8"
      />
      <div>
        <p className="font-semibold text-gray-800">
          Secure Voting System
        </p>
        <p className="text-xs text-gray-500">
          Election Commission of India (Prototype)
        </p>
      </div>
    </div>

    {user && (
      <button
        onClick={onLogout}
        className="text-sm bg-red-600 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    )}
  </div>
</div>
  );
}
