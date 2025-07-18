import React, {useState} from "react";
import './Sign_in.css'

function Sign_in(){
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("")

    async function handleSubmit(e){
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
       
    };

    return(
        <div className="container">
            <h2>Login to Jiseti</h2>
            <form onSubmit={handleSubmit} className="form">
                <label>Email</label>
                <input type="text" placeholder="e.g. example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />

                <label>Password</label>
                <input type="text" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} />

                <button type="submit">Sign In</button>
            </form>
            
            <p className="redirect-text">Don't have an account? <a href="/sign_up">Sign Up</a></p>
        </div>
    )

}
export default Sign_in