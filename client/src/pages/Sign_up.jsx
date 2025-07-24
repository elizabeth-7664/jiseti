import React, {useState} from "react";
import './Sign_up.css';
import API from "../utils/api";
import {useNavigate, Link} from 'react-router-dom';


function Sign_up(){
    const [username, setUsername] = useState("");
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
            await API.post('/api/auth/register', {username, email, password});

            // login user immediately
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const loginRes = await API.post('/api/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const {access_token, user} = loginRes.data;

            login(loginRes.data);
            navigate('/login', {state: {message: 'Registration successful! Please verify your email before logging in.'}});

        }catch (err) {
            console.error('Error:', err);

            if (err.response?.status === 403) {
                setError("Please verify your email before logging in.");
            } else if (err.response?.status === 401) {
                setError("Invalid credentials. Please try again.");
            } else {
                setError("Login failed. Try again.");
            }
        }finally {
            setLoading(false);
        }
    };

    return(
        <div className="container">
            <h2>Create an account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} className="form">
                <label>Username</label>
                <input type="text" placeholder="e.g. matrix_label" value={username} onChange={(e)=> setUsername(e.target.value)} required />

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