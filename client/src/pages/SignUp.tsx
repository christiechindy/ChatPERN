import axios from "axios";
import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

interface ISignUpData {
    name: string,
    email: string,
    password: string,
    repassword: string,
}

export default function SignUp() {
    const [inputs, setInputs] = useState<ISignUpData>({
        name: "",
        email: "",
        password: "",
        repassword: ""
    })

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        await axios.post(`${process.env.REACT_APP_API}/auth/register`, inputs);
        navigate("/login");
    }

    return (
        <div className="auth-card">
            <h1>Sign Up Page</h1>
            <form>
                <div className="inputField">
                    <label htmlFor="signup-email">email</label>
                    <input type="email" id="signup-email" placeholder="email" name="email" onChange={handleChange}/>
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

                <button className="btn" onClick={handleSubmit}>Sign Up</button>
        
            </form>
            <span className="another">Already have an accout? <Link to={"/login"}>Login!</Link> </span>
        </div>
    )
}