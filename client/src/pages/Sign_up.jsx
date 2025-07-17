import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Sign_up(){
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    return(
        <div>
            <h2>Create an account</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" placeholder="e.g. matrix_label" value={name} onChange={(e)=> setName(e.target.value)} required />

                <label>Email</label>
                <input type="text" placeholder="e.g. example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />

                <label>Password</label>
                <input type="text" placeholder="Enter Password" value={password} onChange={(e)=> setPassword(e.target.value)} />

                <label>Confirm Password</label>
                <input type="text" placeholder="Re-enter Password" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} />
            </form>
        </div>
    )
}
export default Sign_up