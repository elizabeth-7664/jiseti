import React, {useState} from "react";
import './Sign_in.css'
import API from "../utils/api";
import {useNavigate, Link} from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

function Sign_in(){
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();
    

    async function handleSubmit(e){
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const formData =  new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await API.post('/api/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            });

            login(res.data);
            navigate('/dashboard');
        }catch (err) {
            console.error('Error:', err);
            const errorMessage = err.response?.data?.detail || "Login failed.Please check your credintials."
            setError(errorMessage);
        }finally {
            setLoading(false);
        }
    };

    return(
        
        <div className="container">
            <h2>Login to Jiseti</h2>
               {error && <p className="bg-red-500/20 text-red-300 border border-red-500/30 p-3 rounded-lg mb-4 text-sm text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <label>Email</label>
                <input type="email" placeholder="e.g. example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />

                <label>Password</label>
                <input type="password" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} />

                <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}
                </button>
            </form>
            
            <p className="redirect-text">Don't have an account? <Link to="/sign_up">Sign Up</Link></p>
        </div>
    )

}
export default Sign_in