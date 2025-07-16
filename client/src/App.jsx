import axios from 'axios';
import { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from './pages/LandingPage';

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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        {/* <Route path="/sign_in" element={<SignIn/>}/>
        <Route path="/sign_up" element={<SignUp/>}/> */}
      </Routes>
    </Router>
  );
}

export default App;
