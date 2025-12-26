export default function Notification({ message }) {
  if (!message) return null;
  return (
    <div className="bg-green-500 text-white p-2 rounded mb-4">{message}</div>
  );
}
