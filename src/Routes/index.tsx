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
import CrearPantalla from "../Views/Funcional/Pantallas/Crear";
import CrearProceso from "../Views/Funcional/Procesos/Cear";
import CrearProducto from "../Views/Adquisiciones/Productos/Crear";
import CrearProveedor from "../Views/Adquisiciones/Proveedor/Crear";
import IngresoProducto from "../Views/Adquisiciones/Productos/Ingreso";
import CrearSolicitud from "../Views/Adquisiciones/Solicitud/Crear";
import CrearCategoria from "../Views/Adquisiciones/Categorias/Nueva";
import SolicitudView from "../Views/Adquisiciones/Solicitud/Validar";

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
                    <Route path="/crearpantalla" element={<CrearPantalla />} />
                    <Route path="/crearproceso" element={<CrearProceso />} />
                    <Route path="/crear_proveedor" element={<CrearProveedor />} />
                    <Route path="/crear_producto" element={<CrearProducto />} />
                    <Route path="/ingresos" element={<IngresoProducto />} />
                    <Route path="/crear_solicitud" element={<CrearSolicitud />} />
                    <Route path="/autorizar_solicitud" element={<SolicitudView />} />
                    <Route path="/crear_categoria" element={<CrearCategoria />} />
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