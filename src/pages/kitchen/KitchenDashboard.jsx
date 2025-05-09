import { useEffect, useState } from "react";
import OrderCard from "../../components/OrderCard";
import { getActiveOrders } from "../../api";

export default function KitchenDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  getActiveOrders()
    .then((data) => {
      console.log("Fetched orders:", data);
      setOrders(data);
    })
    .catch((err) => {
      console.error("Error fetching active orders:", err);
    });
}, []);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Active Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
