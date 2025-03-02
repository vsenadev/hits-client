import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Token from "./pages/Token";

export default function AppRouter() {
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<Login/>} path="/"/>
                <Route element={<Home/>} path="/home"/>
                <Route element={<Chat/>} path="/chat"/>
                <Route element={<Token />} path="/token"/>
            </Routes>
        </BrowserRouter>
    )
}