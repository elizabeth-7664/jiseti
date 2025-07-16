import React from "react";
import { useNavigate } from 'react-router-dom';
import Buttons from "../components/Buttons";

function LandingPage(){
    const navigate = useNavigate();
    
    return(
        <div className="main">
            <h1>Jiseti</h1>
            <p>Jiseti empowers citizens to report corruption and request government intervention for critical issues like poor roads and floding -- making governance more transparent and responsive</p>

            <div className="buttons">
                <Buttons button="Sign In" onClick={()=> navigate('/sign_in')}/>
                <Buttons button="Sign Up" onClick={()=> navigate('/sign_up')} />
            </div>
        </div>
    )
}

export default LandingPage