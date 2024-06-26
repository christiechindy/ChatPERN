import React, { useEffect } from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, TAuthContextData, TInputLogin } from "../context/AuthContext";

export default function LoginPage() {
    const [inputs, setInputs] = useState<TInputLogin>({
        email: "",
        password: ""
    })

    const [err, setError] = useState<string>("");
    const navigate = useNavigate();

    const {login, currentUser} = useContext(AuthContext) as TAuthContextData;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        try {
            await login(inputs);
        } catch (err:any) {
            setError(err.response.data);
        }
    }

    useEffect(() => {
        if (currentUser) return navigate("/");
    }, [currentUser]);

    return (
        <div className="loginPage">
            <div className='auth-card'>
                <h1>Login Page</h1>
                <form>
                    <div className="inputField">
                        <label htmlFor="signup-email">email</label>
                        <input type="email" id="signup-email" placeholder="email" name="email" onChange={handleChange} />
                    </div>

                    <div className="inputField">
                        <label htmlFor="signup-password">password</label>
                        <input type="password" id="signup-password" placeholder="password" name="password" onChange={handleChange} />
                    </div>

                    <button onClick={handleSubmit} className="btn">Login</button>
                </form>

                {err && <p className="error">{err}</p>}

                <span className="another">Doesn't have an account? <Link to={"/register"} style={{ textDecoration: 'none' }}>Register!</Link> </span>
            </div>
        </div>
    );
}