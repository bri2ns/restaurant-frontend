import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // custom styling if needed

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen overflow-hidden bg-black text-white">
      {/* Background image or video */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80"
          alt="Restaurant Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center bg-black/60">
        <h1 className="text-5xl md:text-6xl font-bold animate-fade-in-down mb-4">
          Welcome to <span className="text-yellow-400">Our Restaurant</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in-up">
          Fine dining, memorable moments, and effortless reservations — all at your fingertips.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/customer/reserve")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg shadow-lg"
          >
            Make a Reservation
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg shadow-lg"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
