import { useEffect, useState } from 'react';
import client from './client';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    client.get('/')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error('API error:', err));
  }, []);

  return (
    <div>
      <h1>Restaurant Frontend</h1>
      <p>Backend says: {message || 'Loading...'}</p>
    </div>
  );
}

export default App;
