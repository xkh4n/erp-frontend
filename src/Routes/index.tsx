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
import AgregarProducto from "../Views/Adquisiciones/Productos/Agregar";
import Asignar from "../Views/Adquisiciones/Asignacion/asignar";
import ProtectedRoute from "../Components/ProtectedRoute";
import LoginGuard from "../Components/LoginGuard";
import IngresoInventario from "../Views/Adquisiciones/Inventario/Ingresos";

export default function index() {
    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/devolucion" element={
                        <ProtectedRoute>
                            <BajaProducto />
                        </ProtectedRoute>
                    } />
                    <Route path="/contacto" element={
                        <ProtectedRoute>
                            <Contacto />
                        </ProtectedRoute>
                    } />
                    <Route path="/registro" element={
                        <ProtectedRoute>
                            <Registro />
                        </ProtectedRoute>
                    } />
                    <Route path="/asignarpantalla" element={
                        <ProtectedRoute>
                            <AsignarPantalla />
                        </ProtectedRoute>
                    } />
                    <Route path="/crearpantalla" element={
                        <ProtectedRoute>
                            <CrearPantalla />
                        </ProtectedRoute>
                    } />
                    <Route path="/crearproceso" element={
                        <ProtectedRoute>
                            <CrearProceso />
                        </ProtectedRoute>
                    } />
                    <Route path="/crear_proveedor" element={
                        <ProtectedRoute>
                            <CrearProveedor />
                        </ProtectedRoute>
                    } />
                    <Route path="/crear_producto" element={
                        <ProtectedRoute>
                            <CrearProducto />
                        </ProtectedRoute>
                    } />
                    <Route path="/ingresos" element={
                        <ProtectedRoute>
                            <IngresoProducto />
                        </ProtectedRoute>
                    } />
                    <Route path="/asignacion" element={
                        <ProtectedRoute>
                            <Asignar />
                        </ProtectedRoute>
                    } />
                    <Route path="/crear_solicitud" element={
                        <ProtectedRoute>
                            <CrearSolicitud />
                        </ProtectedRoute>
                    } />
                    <Route path="/autorizar_solicitud" element={
                        <ProtectedRoute>
                            <SolicitudView />
                        </ProtectedRoute>
                    } />
                    <Route path="/crear_categoria" element={
                        <ProtectedRoute>
                            <CrearCategoria />
                        </ProtectedRoute>
                    } />
                    <Route path="/agregar_producto" element={
                        <ProtectedRoute>
                            <AgregarProducto />
                        </ProtectedRoute>
                    } />
                    <Route path="/asignacion" element={
                        <ProtectedRoute>
                            <Asignar />
                        </ProtectedRoute>
                    } />
                    <Route path="/inventario_ingresos" element={
                        <ProtectedRoute>
                            <IngresoInventario />
                        </ProtectedRoute>
                    } />
                </Route>
                <Route element={<LoginLayout />}>
                    <Route path="/login" element={
                        <LoginGuard>
                            <Login />
                        </LoginGuard>
                    } />
                </Route>
                <Route path="/error" element={<ErrorPageWrapper />} />
                <Route path="/unauthorized" element={
                    <ErrorPage 
                        code={403} 
                        message="Acceso No Autorizado" 
                        detail="No tienes permisos para acceder a esta página" 
                    />
                } />
            </Routes>
        </BrowserRouter>
    )
}
const ErrorPageWrapper = () => {
    const location = useLocation();
    const { code, message, detail, actionButton } = location.state || {};
  
    return <ErrorPage code={code} message={message} detail={detail} actionButton={actionButton} />;
};