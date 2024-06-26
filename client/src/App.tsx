import { createBrowserRouter, Outlet, redirect, Route, RouterProvider, Routes } from "react-router-dom";
import AddFriend from "./components/AddFriend";
import List from "./components/List";
import Room from "./components/Room";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import {io, Socket} from "socket.io-client";
import { ProtectedRoute } from "./ProtectedRoute";
import { ClientToServerEvents, ServerToClientEvents } from "./socket-interface/interface";

// const socket = io.connect("http://localhost:3000");
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.REACT_APP_WS!);

const Layout = () => {
    return (
        <>
            <Sidebar />
            <List />
            <Outlet />
        </>
    );
}

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <ProtectedRoute><Layout /></ProtectedRoute>,
            children: [
                {
                    path: "/room/addFriend",
                    element: <AddFriend />
                },
                {
                    path: "/room/:relation_id",
                    element: <Room socket={socket} />
                }
            ]
        },
        {
            path: "/register",
            element: <SignUp />
        },
        {
            path: "/login",
            element: <LoginPage />
        }
    ])

    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;