import { useEffect, useState } from "react";
import OrderCard from "../../components/OrderCard";
import api from "../../api";

export default function KitchenHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => {
      const servedOrders = res.data.filter((order) => order.status === "served");
      setOrders(servedOrders);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No served orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
