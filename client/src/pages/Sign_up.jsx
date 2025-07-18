import React, {useState} from "react";
import './Sign_up.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Sign_up(){
    const [username, setUsername] = useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate  = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if(password !=confirmPassword){
            alert("Passwords do not match!")
            return;
        }

        try{
            const response= await axios.post(`${import.meta.env.VITE_API_URL}/register`,{
                username,
                email,
                password
            })
            
            
        }catch(error){
            console.error("Signup Failed", error.response?.data || error.message);
            alert("Signup Failed")
        }
    }

    return(
        <div className="container">
            <h2>Create an account</h2>
            <form onSubmit={handleSubmit} className="form">
                <label>Username</label>
                <input type="text" placeholder="e.g. matrix_label" value={username} onChange={(e)=> setUsername(e.target.value)} required />

                <label>Email</label>
                <input type="text" placeholder="e.g. example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />

                <label>Password</label>
                <input type="text" placeholder="Enter Password" value={password} onChange={(e)=> setPassword(e.target.value)} />

                <label>Confirm Password</label>
                <input type="text" placeholder="Re-Enter Password" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} />

                <button type="submit">Sign Up</button>
            </form>
            
            <p className="redirect-text">Already have an account? <a href="/sign_in">Sign In</a></p>
        </div>
    )
}
export default Sign_up