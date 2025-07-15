import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data.", error);
      });
  }, []);


  return (
    <div>
      <h1>Jiseti</h1>
      <p>API says: {message || "Loading..."}</p>
    </div>
  );
}

export default App;
