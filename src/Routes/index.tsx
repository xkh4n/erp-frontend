import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Views/Home";
import Contacto from "../Views/Contacto";
import Registro from "../Views/Registro";
import Login from "../Views/Login";
import MainLayout from "../Layout/MainLayout";
import LoginLayout from "../Layout/LoginLayout";

export default function index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/registro" element={<Registro />} />
                </Route>
                <Route element={<LoginLayout />}>
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
