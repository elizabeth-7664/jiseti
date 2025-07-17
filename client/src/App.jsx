import axios from 'axios';
import { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from './pages/LandingPage';
import Sign_up from './pages/Sign_up';
import Sign_in from './pages/Sign_in';


function App() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   axios
  //     .get(`${import.meta.env.VITE_API_URL}/`)
  //     .then((response) => {
  //       setMessage(response.data.message);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data.", error);
  //     });
  // }, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/sign_in" element={<Sign_in/>}/>
        <Route path="/sign_up" element={<Sign_up/>}/>
      </Routes>
    </Router>
  );
}

export default App;
