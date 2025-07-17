import React from "react";
import { useNavigate } from 'react-router-dom';
import Buttons from "../components/Buttons";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Jiseti</h1>

        <p className="text-gray-700 text-lg mb-8">
          Jiseti empowers citizens to report corruption and request government intervention for
          critical issues like poor roads and flooding — making governance more transparent and responsive.
        </p>

        <div className="flex justify-center gap-6">
          <Buttons button="Sign In" onClick={() => navigate('/sign_in')} />
          <Buttons button="Sign Up" onClick={() => navigate('/sign_up')} />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
