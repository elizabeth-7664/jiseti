import React from "react";
import { Link } from 'react-router-dom';

function Buttons(prop){

    return(
        <button><Link>{prop.button}</Link></button>
    )
}

export default Buttons