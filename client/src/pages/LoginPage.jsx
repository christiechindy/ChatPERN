import React, { useEffect } from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const [err, setError] = useState(null);
    const navigate = useNavigate();

    const {login} = useContext(AuthContext);

    const handleChange = (e) => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const {currentUser} = useContext(AuthContext);

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            await login(inputs);
        } catch (err) {
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

                    <button onClick={handleSubmit} class="btn">Login</button>
                </form>

                {err && <p className="error">{err}</p>}

                <span class="another">Doesn't have an account? <Link to={"/register"} style={{ textDecoration: 'none' }}>Register!</Link> </span>
            </div>
        </div>
    );
}