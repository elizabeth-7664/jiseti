import React, {useState} from "react";
import './Sign_up.css';
import API from "../utils/api";
import {useNavigate, Link} from 'react-router-dom';


function Sign_up(){
    const [name, setName] = useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if(password !=confirmPassword){
            setError("Passwords do not match!")
            return;
        }
        setLoading(true);
        try{
            await API.post('/api/register', {name, email, password});
            navigate('/sign_in', {state: {message: 'Registration successful! Proceed to Login.'}});

        }catch (err) {
            console.error('Error:', err);
            const errorMessage = err.response?.data.detail || 'Registration failed. Please try again.';
            setError(errorMessage);
            
        }finally {
            setLoading(false);
        }
    };

    return(
        <div className="container">
            <h2>Create an account</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="form">
                <label>Username</label>
                <input type="text" placeholder="e.g. matrix_label" value={name} onChange={(e)=> setName(e.target.value)} required />

                <label>Email</label>
                <input type="email" placeholder="e.g. example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />

                <label>Password</label>
                <input type="password" placeholder="Enter Password" value={password} onChange={(e)=> setPassword(e.target.value)} />

                <label>Confirm Password</label>
                <input type="password" placeholder="Re-Enter Password" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} />

                <button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
            
            <p className="redirect-text">Already have an account? <Link to="/sign_in">Sign In </Link></p>
        </div>
    )
}
export default Sign_up