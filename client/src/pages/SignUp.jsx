import axios from "axios";
import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        repassword: ""
    })

    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post("http://localhost:5000/auth/register", inputs);
        navigate("/login");
    }

    return (
        <div className="auth-card">
            <h1>Sign Up Page</h1>
            <button className='btn'>Sign Up with Google</button>
            <span class="orText">OR</span>
            <form>
                <div className="inputField">
                    <label htmlFor="signup-email">email</label>
                    <input type="email" id="signup-email" placeholder="email" name="email" onChange={handleChange}/>
                    {/* {(emailVal && emailVal.includes("@") && emailVal.includes(".")) ? 
                    "" : <span className='inputStatus'>Email is incorrect</span>} */}
                </div>

                <div className="inputField">
                    <label htmlFor="signup-username">Name</label>
                    <input type="text" id="signup-username" placeholder="name" name="name" onChange={handleChange}/>
                </div>

                <div className="inputField">
                    <label htmlFor="signup-password">password</label>
                    <input type="password" id="signup-password" placeholder="password" name="password" onChange={handleChange} />
                </div>

                <div className="inputField">
                    <label htmlFor="fill">Reenter password</label>
                    <input type="password" id="fill" placeholder="reenter password" name="repassword" onChange={handleChange} />
                    {(inputs.password!==inputs.repassword) ? <span className='inputStatus'>The password doesnt match</span> : ""}
                </div>

                <button class="btn" onClick={handleSubmit}>Sign Up</button>
        
            </form>
            <span className="another">Already have an accout? <Link to={"/login"}>Login!</Link> </span>
        </div>
    )
}