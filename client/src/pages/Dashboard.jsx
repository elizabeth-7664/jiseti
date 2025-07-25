import React from "react";
import { useAuth } from "../context/AuthContext";

function Dashboard(){
    const {user} = useAuth()
    return(
            <h1>Hello {user?.username}!</h1>
    )

}
export default Dashboard;