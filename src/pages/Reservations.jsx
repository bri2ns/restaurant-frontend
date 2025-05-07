import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get('/reservations')
      .then(res => setReservations(res.data))
      .catch(err => console.error('Failed to fetch reservations:', err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reservations</h1>
      <ul className="space-y-2">
        {reservations.map(r => (
          <li key={r.id} className="border p-2 rounded">
            {r.customer_name} - Table {r.table_number} @ {r.date_time}
          </li>
        ))}
      </ul>
    </div>
  );
}