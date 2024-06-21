import { ReactNode, createContext, useState, useEffect } from "react";
import React from 'react';
import axios from "axios";

export type TAuthContextData = {
    currentUser: TCurrentUser|null;
    login: (inputs: TInputLogin) => Promise<void>;
    logout: () => Promise<void>;
}

export type TInputLogin = {
    email: string;
    password: string
}

export type TCurrentUser = {
    email: string;
    name: string;
    pict?: string;
    user_id: number;
}

export const AuthContext = createContext<TAuthContextData | null>(null);

interface IProps {
    children: ReactNode;
}

export const AuthContextProvider = ({children}: IProps) => {
    const [currentUser, setCurrentUser] = useState<TCurrentUser | null>(() => {
        const storedUser = localStorage.getItem("user");
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const login = async (inputs:TInputLogin) => {
        const res = await axios.post("http://localhost:5000/auth/login", inputs);
        setCurrentUser(res.data);
    }
    console.log("current user", currentUser);

    const logout = async () => {
        await axios.post("http://localhost:5000/auth/logout");
        setCurrentUser(null);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{currentUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}