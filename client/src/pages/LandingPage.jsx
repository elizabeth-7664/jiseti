import React from "react";
import {Link,useNavigate } from 'react-router-dom';

function LandingPage(){
    
    return(
        <div className="main">
            <h1>Jiseti</h1>
            <p>Jiseti empowers citizens to report corruption and request government intervention for critical issues like poor roads and floding -- making governance more transparent and responsive</p>

            <div className="buttons">
                <Link to="/sign_in">Sign In</Link>
                <Link to="/sign_up">Sign Up</Link>
            </div>

        </div>
    )
}

export default LandingPage