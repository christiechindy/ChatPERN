import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from "./context/AuthContext";
import { FriendChatContextProvider } from "./context/FriendChatContext";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <AuthContextProvider>
        <FriendChatContextProvider>
            <App />
        </FriendChatContextProvider>
    </AuthContextProvider>
);
