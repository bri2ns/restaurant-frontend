import { updateOrderStatus } from "../api";

export default function OrderCard({ order }) {
  const nextStatus = {
    placed: "cooking",
    cooking: "ready"
  }[order.status];

  const statusButtonColor = {
    placed: "bg-yellow-500 hover:bg-yellow-600",
    cooking: "bg-orange-500 hover:bg-orange-600",
    ready: "bg-green-600 hover:bg-green-700"
  }[order.status] || "bg-gray-500";

  const handleStatusUpdate = () => {
    if (nextStatus) {
      updateOrderStatus(order.id, nextStatus).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 space-y-2">
      <h2 className="text-lg font-semibold">Order #{order.id}</h2>
      <ul>
        {order.items_ordered.map((item, idx) => (
          <li key={idx}>
            {item} x{order.quantities[idx]}
          </li>
        ))}
      </ul>
      {order.special_requests && (
        <p className="text-sm italic">Note: {order.special_requests}</p>
      )}
      <p className="text-sm">Status: <strong>{order.status}</strong></p>
      {nextStatus && (
        <button
          onClick={handleStatusUpdate}
          className={`mt-2 text-white px-3 py-1 rounded ${statusButtonColor}`}
        >
          Mark as {nextStatus}
        </button>
      )}
    </div>
  );
}
