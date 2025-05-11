import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Optional for styles or animations

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-cover bg-center text-white" style={{ backgroundImage: 'url(/background.jpg)' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
          Welcome to <span className="text-yellow-400">The Modern Fork</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-xl animate-fade-in-up delay-100">
          Effortless reservations. Real-time updates. The dining experience you deserve.
        </p>

        <div className="flex gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
