import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reservations from './pages/Reservations';
import Navbar from './components/Navbar';
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Reservations />} />
          <Route path="/login" element={<Login />} />

          <Route path="/reservations" element={<RequireAuth><Reservations /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;