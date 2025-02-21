import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function AppRouter() {
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<Login/>} path="/"/>
                <Route element={<Home/>} path="/home"/>
            </Routes>
        </BrowserRouter>
    )
}