import React from "react";
import { useAuth } from "../context/AuthContext";
import Navigations from "../components/Navigations";

function Dashboard(){
    const {user} = useAuth()
    return(
        <>
            <Navigations/>
            <h1>Hello {user?.username}!</h1>
        </>
    )

}
export default Dashboard;