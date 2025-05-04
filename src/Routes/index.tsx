import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../Views/Home";
import Contacto from "../Views/Contacto";
import Registro from "../Views/Registro";
import Login from "../Views/Login";
import MainLayout from "../Layout/MainLayout";
import LoginLayout from "../Layout/LoginLayout";
import ErrorPage from "../Views/Errors/ErrorPage";
import BajaProducto from "../Views/Reciclaje/BajaProducto";
import AsignarPantalla from "../Views/Funcional/Pantallas/Asignar";

export default function index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/devolucion" element={<BajaProducto />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/asignarpantalla" element={<AsignarPantalla />} />
                </Route>
                <Route element={<LoginLayout />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route path="/error" element={<ErrorPageWrapper />} />
            </Routes>
        </BrowserRouter>
    )
}
const ErrorPageWrapper = () => {
    const location = useLocation();
    const { code, message, detail } = location.state || {};
  
    return <ErrorPage code={code} message={message} detail={detail} />;
};