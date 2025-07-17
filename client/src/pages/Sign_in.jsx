import React, {useState} from "react";

function Sign_in(){
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("")

    async function handleSubmit(e){
        e.preventDefault()
    }

    return(
        <div>
            <h2>Login to Jiseti</h2>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="text" placeholder="e.g. example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />

                <label>Password</label>
                <input type="text" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} />

                <button type="submit">Sign In</button>
            </form>
            
            <p>Don't have an account? <a href="/sign_up">Sign Up</a></p>
        </div>
    )

}
export default Sign_in