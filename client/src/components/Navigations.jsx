import React from "react";
import Buttons from "./Buttons";

function Navigations(){
    return(
        <div>
            <h1>Jiseti</h1>
            <Buttons
                size="lg"
                button="Home"
            />
            <Buttons
                size="lg"
                button="Add Post"
            />
            <Buttons
                size="lg"
                button="Posts"
            />
        </div>
    )
}
export default Navigations