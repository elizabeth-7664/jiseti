import axios from 'axios';
import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom"; // ⛔️ Removed BrowserRouter as Router
import LandingPage from './pages/LandingPage';
import Sign_up from './pages/Sign_up';
import Sign_in from './pages/Sign_in';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching backend message", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* ✅ NO Router here */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign_in" element={<Sign_in />} />
        <Route path="/sign_up" element={<Sign_up />} />
      </Routes>

      {message && (
        <div className="fixed bottom-4 right-4 p-3 bg-green-100 border border-green-400 rounded text-green-700 text-sm shadow">
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
