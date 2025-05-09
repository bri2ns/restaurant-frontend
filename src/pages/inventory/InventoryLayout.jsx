import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function InventoryLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar role="inventory" />
      <main className="flex-1 p-4 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
