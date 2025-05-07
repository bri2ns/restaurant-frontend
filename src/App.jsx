import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reservations from './pages/Reservations';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Reservations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;