import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { handleError } from "../../../../Library/Utils/errorHandler";
import { useAuth } from "../../../../Library/Context/AuthContext";


type CentroCosto = {
    _id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    fechaCreacion: string;
    fechaModificacion: string;
}

type Solicitud = {
    _id: string;
    nroSolicitud: string;
    solicitante: string;
    cargoSolicitante: string;
    beneficiario: string;
    emailSolicitante: string;
    telefonoSolicitante: string;
    telefonoBeneficiario?: string;
    cuentaBeneficiario?: string;
    fechaCreacion: string;
    estado: string;
    prioridad: string;
    fechaRequerida?: string;
    centroCosto?: string | CentroCosto;
    observaciones?: string;
}

type DetalleSolicitud = {
    nroSolicitud: string;
    producto: string;
    productoId: string;
    cantidad: number;
    cantidadRecibida: number;
    cantidadPendiente: number;
    recepciones: Array<{
        numeroSerie: string;
        codigoInventario: string;
        fechaRecepcion: string;
    }>;
}

type DetalleSolicitudBackend = {
    nroSolicitud: string;
    producto: string;
    productoId: string;
    cantidad: number;
    cantidadRecibida?: number;
    cantidadPendiente?: number;
    recepciones?: Array<{
        numeroSerie: string;
        codigoInventario: string;
        fechaRecepcion: string;
    }>;
}

type DetalleRecepcion = {
    productoId: string;
    producto: string;
    numeroSerie: string;
    numeroDocumento: string | number;
    fechaRecepcion: string;
}

type Proveedor = {
    _id: string;
    razonSocial: string;
    rut: string;
    email?: string;
    telefono?: string;
}

export default function IngresoProducto() {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken, isAuthenticated } = useAuth();

    // Función helper para manejo de errores con contexto fijo
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);

    const [solicitud, setSolicitud] = useState<Solicitud[]>([]);
    const [detalleSolicitud, setDetalleSolicitud] = useState<DetalleSolicitud[]>([]);
    
    // Estados para el popup de recepción
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProductoRecepcion, setSelectedProductoRecepcion] = useState<DetalleSolicitud | null>(null);
    const [serialNumber, setNumeroSerie] = useState("");
    const [newMarca, setNewMarca] = useState("");
    const [newModelo, setNewModelo] = useState("");
    const [newValor, setNewValor] = useState("");
    
    // Nuevos estados para proveedores y documentos
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [selectedProveedor, setSelectedProveedor] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [numeroDocumento, setNumeroDocumento] = useState("");
    
    // Estados para el control de recepciones
    const [detalleRecepciones, setDetalleRecepciones] = useState<DetalleRecepcion[]>([]);
    
    // Estados mínimos para mantener funcionalidad
    const [selectedSolicitud, setSelectedSolicitud] = useState("");
    const [centroCostoID, setCentroCostoID] = useState("");
    /*
    const [guardaSolicitud, setGuardaSolicitud] = useState(false);
*/
    // Funcion para guardar producto
    const handlerGuardarProducto = async () => {
        const centroCosto = centroCostoID;
        const saveMarca = newMarca;
        const productoId = selectedProductoRecepcion?.productoId || "";
        const numeroSerie = serialNumber || "";
        const valor = newValor;

        if (!productoId || !numeroSerie || !centroCosto || !saveMarca || !selectedProveedor || !tipoDocumento || !numeroDocumento.trim()) {
            toast.error("Por favor complete todos los campos requeridos", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Encontrar el producto específico en el detalle de la solicitud
        const productoIndex = detalleSolicitud.findIndex(p => p.productoId === productoId);
        if (productoIndex === -1) {
            toast.error("Producto no encontrado en la solicitud", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Datos para enviar al backend
        const datosEnviar = {
            "productoId": productoId,
            "cantidad": 1, // Siempre enviamos 1 producto por recepción individual
            "numeroSerie": numeroSerie,
            "nroSolicitud": selectedProductoRecepcion?.nroSolicitud || "",
            "centroCosto": centroCosto,
            "valor": valor || "0",
            "modelo": newModelo || "",
            "marca": saveMarca,
            "proveedorId": selectedProveedor,
            "tipoDocumento": tipoDocumento,
            "numeroDocumento": numeroDocumento
        };

        try {
            // Llamada real al backend
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/producto/recibir`,
                datosEnviar,{
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.codigo === 201) {
                toast.success("Producto guardado exitosamente", {
                    position: "top-right",
                    autoClose: 3000,
                });

                // Verificar el estado desde el backend
                const { productoCompleto, solicitudCompleta } = response.data.data || {};

                // Recargar el detalle de la solicitud para obtener datos actualizados del backend
                await recargarDetalleSolicitud();

                if (productoCompleto) {
                    const productoActual = detalleSolicitud.find(p => p.productoId === productoId);
                    toast.success(`✅ Producto "${productoActual?.producto || 'producto'}" completamente recibido`, {
                        position: "top-right",
                        autoClose: 4000,
                    });
                }

                if (solicitudCompleta) {
                    toast.success(`🎉 ¡Solicitud completamente recibida! Finalizando automáticamente...`, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                    
                    // Ejecutar automáticamente la función de finalizar recepciones
                    setTimeout(() => {
                        handlerGuardarRecepciones();
                        // Recargar las solicitudes para excluir la completada
                        recargarSolicitudes();
                    }, 2000); // Esperar 2 segundos para que el usuario vea el mensaje
                }

            } else {
                toast.error(`Error al guardar el producto: ${response.data.mensaje || 'Error desconocido'}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error en handlerGuardarProducto:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.mensaje || error.message;
                toast.error(`Error al guardar el producto: ${errorMessage}`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            } else {
                handleErrorWithContext(error);
            }
        }
    };
    // Función separada para recargar solicitudes
    const recargarSolicitudes = useCallback(async () => {
        try {
            if (!isAuthenticated || !accessToken) {
                console.warn('Usuario no autenticado para cargar solicitudes');
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/solicitud/aprobadas`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data && response.data.codigo === 200) {
                setSolicitud(response.data.data || []);
            } else {
                setSolicitud([]);
                toast.error("Error al cargar las solicitudes aprobadas", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error al recargar solicitudes:', error);
            setSolicitud([]);
            if (axios.isAxiosError(error)) {
                if (error.code === 'ERR_EMPTY_RESPONSE' || error.message.includes('ERR_EMPTY_RESPONSE')) {
                    toast.error("El servidor no está respondiendo. Verifique que el backend esté ejecutándose.", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } else {
                    toast.error(`Error de conexión: ${error.message}`, {
                        position: "top-right",
                        autoClose: 4000,
                    });
                }
            } else {
                handleErrorWithContext(error);
            }
        }
    }, [handleErrorWithContext, isAuthenticated, accessToken]);

    // Función separada para recargar el detalle de la solicitud
    const recargarDetalleSolicitud = useCallback(async () => {
        if (!selectedSolicitud) return;
        
        try {
            if (!isAuthenticated || !accessToken) {
                console.warn('Usuario no autenticado para cargar detalle de solicitud');
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/solicitud/detalle/recepcion`,
                { id: selectedSolicitud },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data && response.data.codigo === 200) {
                setDetalleSolicitud(response.data.data || []);
                // Agregar todas las recepciones existentes del backend al estado local
                const todasLasRecepciones: DetalleRecepcion[] = [];
                (response.data.data || []).forEach((detalle: DetalleSolicitudBackend) => {
                    // Convertir las recepciones del backend al formato local
                    const recepcionesLocales = (detalle.recepciones || []).map((r: { numeroSerie: string; codigoInventario: string; fechaRecepcion: string }) => ({
                        productoId: detalle.productoId,
                        producto: detalle.producto,
                        numeroSerie: r.numeroSerie,
                        numeroDocumento: r.codigoInventario, // El backend retorna 'codigoInventario'
                        fechaRecepcion: r.fechaRecepcion
                    }));
                    todasLasRecepciones.push(...recepcionesLocales);
                });
                setDetalleRecepciones(todasLasRecepciones);
            } else {
                toast.error("Error al obtener el detalle de la solicitud", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error al recargar detalle de solicitud:', error);
            if (axios.isAxiosError(error)) {
                toast.error(`Error al cargar el detalle: ${error.message}`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        }
    }, [selectedSolicitud, isAuthenticated, accessToken]);

    // Función para cargar proveedores
    const cargarProveedores = useCallback(async () => {
        try {
            if (!isAuthenticated || !accessToken) {
                console.warn('⚠️  Usuario no autenticado - redirigiendo a login');
                navigate('/error', {
                    state: {
                        code: 401,
                        message: 'Usuario no autenticado',
                        detail: 'Debe iniciar sesión para acceder a esta funcionalidad.',
                        actionButton: {
                            text: 'Iniciar Sesión',
                            path: '/login'
                        }
                    }
                });
                return;
            }
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/proveedor/todos`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Verificar si tenemos proveedores - ajustado para la estructura real del backend
            if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length >= 1) {
                setProveedores(response.data.data);
            } else if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length === 0) {
                // No hay proveedores en la base de datos - redirigir a error con opción de crear
                navigate('/error', {
                    state: {
                        code: 404,
                        message: 'No se encontraron Proveedores',
                        detail: 'Para poder ingresar productos es necesario tener al menos un proveedor registrado en el sistema.',
                        actionButton: {
                            text: '¿Quieres Crear el Proveedor?',
                            path: '/crear_proveedor'
                        }
                    }
                });
            } else {
                setProveedores([]);
                // Solo redirigir a error si realmente no hay data o la estructura es incorrecta
                if (!response.data || !response.data.data) {
                    navigate('/error', {
                        state: {
                            code: 500,
                            message: 'Error al cargar proveedores',
                            detail: 'No se encontraron Proveedores - Estructura de respuesta incorrecta.'
                        }
                    });
                } else {
                    // Si hay data pero no es array o tiene estructura extraña, intentar usar los datos de todos modos
                    if (response.data.data) {
                        setProveedores(response.data.data);
                    }
                }
            }
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
            setProveedores([]);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    // Error 404 específico - probablemente no hay proveedores
                    navigate('/error', {
                        state: {
                            code: 404,
                            message: 'No se encontraron Proveedores',
                            detail: 'Para poder ingresar productos es necesario tener al menos un proveedor registrado en el sistema.',
                            actionButton: {
                                text: '¿Quieres Crear el Proveedor?',
                                path: '/crear_proveedor'
                            }
                        }
                    });
                } else {
                    navigate('/error', {
                        state: {
                            code: error.response?.status || 500,
                            message: 'Error de conexión al cargar proveedores',
                            detail: 'No se encontraron Proveedores. Verifique que el servidor esté funcionando correctamente.',
                            actionButton: {
                                text: '¿Quieres Crear el Proveedor?',
                                path: '/crear_proveedor'
                            }
                        }
                    });
                }
            } else {
                handleErrorWithContext(error);
            }
        }
    }, [navigate, handleErrorWithContext, isAuthenticated, accessToken]);

    useEffect(() => {
        recargarSolicitudes();
        cargarProveedores(); // Cargar proveedores al inicializar
    }, [recargarSolicitudes, cargarProveedores]); // Ahora depende de la función memoizada

    useEffect(() => {
        if(!selectedSolicitud) return;
        const solicitudCompleta = solicitud.find(s => s._id === selectedSolicitud);
        const fetchCentroCosto = async () => {
            if (!isAuthenticated || !accessToken) {
                console.warn('Usuario no autenticado para cargar centro de costo');
                return;
            }

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/solicitud/centro-costo`, 
                { nroSolicitud: solicitudCompleta?.nroSolicitud },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setCentroCostoID(data.data);
        };
        fetchCentroCosto();
    }, [selectedSolicitud, solicitud, isAuthenticated, accessToken]);
    // Función para manejar el cambio de solicitud
    const handleSolicitudChange = async (solicitudId: string) => {
        setSelectedSolicitud(solicitudId);
        
        if (solicitudId) {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar detalle de solicitud');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/solicitud/detalle/recepcion`,
                    { id: solicitudId },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (response.data.codigo === 200) {
                    setDetalleSolicitud(response.data.data);
                    // Agregar todas las recepciones existentes del backend al estado local
                    const todasLasRecepciones: DetalleRecepcion[] = [];
                    response.data.data.forEach((detalle: DetalleSolicitudBackend) => {
                        // Convertir las recepciones del backend al formato local
                        const recepcionesLocales = (detalle.recepciones || []).map((r: { numeroSerie: string; codigoInventario: string; fechaRecepcion: string }) => ({
                            productoId: detalle.productoId,
                            producto: detalle.producto,
                            numeroSerie: r.numeroSerie,
                            numeroDocumento: r.codigoInventario, // El backend retorna 'codigoInventario'
                            fechaRecepcion: r.fechaRecepcion
                        }));
                        todasLasRecepciones.push(...recepcionesLocales);
                    });
                    setDetalleRecepciones(todasLasRecepciones);
                } else {
                    toast.error("Error al obtener el detalle de la solicitud", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                toast.error(`Error al obtener el detalle de la solicitud. ${error}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
                setDetalleSolicitud([]);
                setDetalleRecepciones([]);
            }
        } else {
            setDetalleSolicitud([]);
            setDetalleRecepciones([]);
        }
    };

    // Función para obtener las observaciones de la solicitud seleccionada
    const getSelectedSolicitudObservaciones = () => {
        if (selectedSolicitud) {
            const solicitudSeleccionada = solicitud.find(s => s._id === selectedSolicitud);
            return solicitudSeleccionada?.observaciones || "";
        }
        return "";
    };

    // Función para obtener la cantidad pendiente de un producto (desde el backend)
    const getCantidadPendiente = (productoId: string): number => {
        const detalle = detalleSolicitud.find(d => d.productoId === productoId);
        if (!detalle) {
            console.error(`No se encontró detalle para el producto: ${productoId}`);
            return 0;
        }
        // Usar la cantidad pendiente que viene directamente del backend
        return detalle.cantidadPendiente || (detalle.cantidad - (detalle.cantidadRecibida || 0));
    };

    // Funciones para manejar el popup de recepción
    const handleRecibirClick = (detalle: DetalleSolicitud) => {
        setSelectedProductoRecepcion(detalle);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedProductoRecepcion(null);
        setNumeroSerie("");
        setNewMarca("");
        setNewModelo("");
        setNewValor("");
        // Limpiar nuevos campos
        setSelectedProveedor("");
        setTipoDocumento("");
        setNumeroDocumento("");
    };
    const handleAceptarRecepcion = async () => {

        if (!selectedProveedor) {
            toast.error("Por favor seleccione un proveedor", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (!tipoDocumento) {
            toast.error("Por favor seleccione el tipo de documento", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (!numeroDocumento.trim()) {
            toast.error("Por favor ingrese el número de documento", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (!selectedProductoRecepcion || !serialNumber.trim()) {
            toast.error("Por favor complete el número de serie", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (!newMarca.trim()) {
            toast.error("Por favor complete la marca", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Verificar que aún hay cantidad pendiente por recibir
        const cantidadPendiente = getCantidadPendiente(selectedProductoRecepcion.productoId);
        if (cantidadPendiente <= 0) {
            toast.error("Este producto ya ha sido completamente recibido", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Verificar que el número de serie no esté ya en uso localmente
        const serieExistente = detalleRecepciones.some(r => 
            r.numeroSerie.toLowerCase() === serialNumber.trim().toLowerCase()
        );
        if (serieExistente) {
            toast.error("El número de serie ya está registrado en otra recepción", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Llamar a la función para guardar el producto
        await handlerGuardarProducto();
        
        // Cerrar el popup automáticamente después de guardar (exitoso o fallido)
        handleClosePopup();
    };

    // Función que se ejecuta automáticamente cuando toda la solicitud está completa
    const handlerGuardarRecepciones = async () => {
        if (!selectedSolicitud) {
            toast.error("No se ha seleccionado una solicitud", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Obtener información de la solicitud antes de limpiarla
        const solicitudSeleccionada = solicitud.find(s => s._id === selectedSolicitud);
        const nroSolicitud = solicitudSeleccionada?.nroSolicitud || selectedSolicitud;

        // Mensaje final cuando toda la solicitud está completa
        toast.success(`🎉 ¡Solicitud ${nroSolicitud} completamente procesada! Total recepciones: ${detalleRecepciones.length}`, {
            position: "top-right",
            autoClose: 5000,
        });
        
        // Limpiar la solicitud actual para permitir procesar otra
        setSelectedSolicitud("");
        setDetalleSolicitud([]);
        setDetalleRecepciones([]);
    };

    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
        <ToastContainer aria-label="Notificaciones de la aplicación" />
        <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
                Ingreso de Producto
            </h1>
            <form className="w-full">
            <div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-6 min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-1 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="cbo_solicitud"
                    >
                        Solicitud
                    </label>
                    <select
                        id="cbo_solicitud"
                        name="cbo_solicitud"
                        value={selectedSolicitud}
                        onChange={(e) => handleSolicitudChange(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Seleccione la Solicitud</option>
                        {solicitud.map((solicitudes) => (
                        <option key={solicitudes._id} value={solicitudes._id}>
                            {solicitudes.nroSolicitud}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-1 min-[1200px]:col-span-2 min-[1400px]:col-span-10">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="desc_solicitud"
                    >
                        Observaciones de la Solicitud
                    </label>
                    <input
                        id="desc_solicitud"
                        type="text"
                        name="desc_solicitud"
                        value={getSelectedSolicitudObservaciones()}
                        readOnly
                        className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm bg-gray-50"
                        placeholder="Observaciones de la solicitud seleccionada"
                    />
                </div> 

            </div>
            
            {/* Información de la solicitud seleccionada */}
            {selectedSolicitud && (
                <div className="mt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Información de la Solicitud</h3>
                        {(() => {
                            const solicitudSeleccionada = solicitud.find(s => s._id === selectedSolicitud);
                            return solicitudSeleccionada ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-blue-700">Solicitante:</span>
                                        <p className="text-blue-800">{solicitudSeleccionada.solicitante}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Cargo:</span>
                                        <p className="text-blue-800">{solicitudSeleccionada.cargoSolicitante}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Beneficiario:</span>
                                        <p className="text-blue-800">{solicitudSeleccionada.beneficiario}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Email:</span>
                                        <p className="text-blue-800">{solicitudSeleccionada.emailSolicitante}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Teléfono:</span>
                                        <p className="text-blue-800">{solicitudSeleccionada.telefonoSolicitante}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-700">Prioridad:</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                                            solicitudSeleccionada.prioridad === 'urgente' ? 'bg-red-100 text-red-800' :
                                            solicitudSeleccionada.prioridad === 'alta' ? 'bg-orange-100 text-orange-800' :
                                            solicitudSeleccionada.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {solicitudSeleccionada.prioridad}
                                        </span>
                                    </div>
                                    {solicitudSeleccionada.fechaRequerida && (
                                        <div>
                                            <span className="font-medium text-blue-700">Fecha Requerida:</span>
                                            <p className="text-blue-800">{new Date(solicitudSeleccionada.fechaRequerida).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    {solicitudSeleccionada.centroCosto && (
                                        <div>
                                            <span className="font-medium text-blue-700">Centro de Costo:</span>
                                            <p className="text-blue-800">
                                                {typeof solicitudSeleccionada.centroCosto === 'object' 
                                                    ? solicitudSeleccionada.centroCosto.nombre || solicitudSeleccionada.centroCosto.codigo || 'N/A'
                                                    : solicitudSeleccionada.centroCosto}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-medium text-blue-700">Estado:</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                                            solicitudSeleccionada.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                                            solicitudSeleccionada.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            solicitudSeleccionada.estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {solicitudSeleccionada.estado}
                                        </span>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                    </div>
                </div>
            )}
            
            {/* Tabla de detalle de la solicitud */}
            {selectedSolicitud && detalleSolicitud.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalle de la Solicitud - Recepción de Productos</h3>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nro. Solicitud
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Recepción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cantidad Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Recibida
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pendiente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {detalleSolicitud.map((detalle, index) => {
                                    const cantidadPendiente = detalle.cantidadPendiente || (detalle.cantidad - (detalle.cantidadRecibida || 0));
                                    const cantidadRecibida = detalle.cantidadRecibida || 0;
                                    const estaCompleto = cantidadPendiente === 0;
                                    return (
                                        <tr key={`${detalle.productoId}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {detalle.nroSolicitud}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date().toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {detalle.producto}
                                                <div className="text-xs text-gray-400">ID: {detalle.productoId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {detalle.cantidad}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    cantidadRecibida > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {cantidadRecibida}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    cantidadPendiente > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {cantidadPendiente}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {estaCompleto ? (
                                                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        ✓ RECIBIDO
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleRecibirClick(detalle);
                                                        }}
                                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                                                    >
                                                        Recibir ({cantidadPendiente})
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Resumen de recepciones */}
            {detalleRecepciones.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Recepciones</h3>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Número de Serie
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Código de Inventario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha de Recepción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {detalleRecepciones.map((recepcion, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {recepcion.producto}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {recepcion.numeroSerie}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {recepcion.numeroDocumento}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(recepcion.fechaRecepcion).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Popup para recepción de productos */}
            {showPopup && selectedProductoRecepcion && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border max-w-4xl w-[95%] shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-4">Recepción de Producto</h3>
                            
                            {/* Información del producto */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Producto:</span>
                                        <p className="text-gray-900">{selectedProductoRecepcion.producto}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Cantidad Total:</span>
                                        <p className="text-gray-900">{selectedProductoRecepcion.cantidad}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Pendiente por Recibir:</span>
                                        <span className="ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {getCantidadPendiente(selectedProductoRecepcion.productoId)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mostrar recepciones anteriores si existen */}
                            {(() => {
                                const recepcionesProducto = detalleRecepciones.filter(r => r.productoId === selectedProductoRecepcion.productoId);
                                return recepcionesProducto.length > 0 && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-medium text-blue-700 mb-3">Recepciones Realizadas ({recepcionesProducto.length}):</p>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-xs">
                                                <thead>
                                                    <tr className="bg-blue-100">
                                                        <th className="px-2 py-1 text-left font-medium text-blue-700">Serie</th>
                                                        <th className="px-2 py-1 text-left font-medium text-blue-700">Documento</th>
                                                        <th className="px-2 py-1 text-left font-medium text-blue-700">Fecha</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recepcionesProducto.map((recepcion, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}>
                                                            <td className="px-2 py-1 text-blue-600">{recepcion.numeroSerie}</td>
                                                            <td className="px-2 py-1 text-blue-600">{recepcion.numeroDocumento}</td>
                                                            <td className="px-2 py-1 text-blue-600">{new Date(recepcion.fechaRecepcion).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Formulario de campos en grilla responsive */}
                            <div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
                                {/* Primera fila: Proveedor, Tipo Documento, Número Documento */}
                                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="proveedor">
                                        Proveedor *
                                    </label>
                                    <select
                                        id="proveedor"
                                        value={selectedProveedor}
                                        onChange={(e) => setSelectedProveedor(e.target.value)}
                                        className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Seleccione un proveedor</option>
                                        {proveedores.map((proveedor) => (
                                            <option key={proveedor._id} value={proveedor._id}>
                                                {proveedor.razonSocial}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-3 min-[1400px]:col-span-5">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tipoDocumento">
                                        Tipo de Documento *
                                    </label>
                                    <select
                                        id="tipoDocumento"
                                        value={tipoDocumento}
                                        onChange={(e) => setTipoDocumento(e.target.value)}
                                        disabled={!selectedProveedor}
                                        className={`w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!selectedProveedor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        required
                                    >
                                        <option value="">Seleccione tipo</option>
                                        <option value="GUIA DESPACHO">GUIA DESPACHO</option>
                                        <option value="FACTURA">FACTURA</option>
                                        <option value="ORDEN DE RETIRO">ORDEN DE RETIRO</option>
                                        <option value="ORDEN DE TRANSPORTE">ORDEN DE TRANSPORTE</option>
                                    </select>
                                </div>
                                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-3 min-[1200px]:col-span-3 min-[1400px]:col-span-3">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="numeroDocumento">
                                        Número de Documento *
                                    </label>
                                    <input
                                        id="numeroDocumento"
                                        type="text"
                                        value={numeroDocumento}
                                        onChange={(e) => setNumeroDocumento(e.target.value.toUpperCase())}
                                        disabled={!selectedProveedor || !tipoDocumento}
                                        className={`w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!selectedProveedor || !tipoDocumento ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="Ingrese número del documento"
                                        required
                                    />
                                </div>
                                
                                {/* Segunda fila: Marca, Modelo, Número de Serie, Valor */}
                                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-3">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="marca">
                                        Marca *
                                    </label>
                                    <input
                                        id="marca"
                                        type="text"
                                        value={newMarca}
                                        onChange={(e) => setNewMarca(e.target.value.toUpperCase())}
                                        disabled={!selectedProveedor}
                                        className={`w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!selectedProveedor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="Ingrese la marca"
                                        required
                                    />
                                </div>
                                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-3 min-[1400px]:col-span-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="modelo">
                                        Modelo
                                    </label>
                                    <input
                                        id="modelo"
                                        type="text"
                                        value={newModelo}
                                        onChange={(e) => setNewModelo(e.target.value.toUpperCase())}
                                        disabled={!selectedProveedor}
                                        className={`w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!selectedProveedor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="Ingrese el modelo"
                                    />
                                </div>
                                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-3 min-[1400px]:col-span-3">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="numeroSerie">
                                        Número de Serie *
                                    </label>
                                    <input
                                        id="numeroSerie"
                                        type="text"
                                        value={serialNumber}
                                        onChange={(e) => setNumeroSerie(e.target.value.toUpperCase())}
                                        disabled={!selectedProveedor}
                                        className={`w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!selectedProveedor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="Ingrese el número de serie"
                                        required
                                    />
                                </div>
                                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="valor">
                                        Valor
                                    </label>
                                    <input
                                        id="valor"
                                        type="text"
                                        value={newValor}
                                        onChange={(e) => setNewValor(e.target.value)}
                                        disabled={!selectedProveedor}
                                        className={`w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!selectedProveedor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="Ingrese el valor"
                                    />
                                </div>
                            </div>
                            
                            {/* Botones */}
                            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                                <button
                                    onClick={handleClosePopup}
                                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition duration-200 order-2 sm:order-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAceptarRecepcion}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 order-1 sm:order-2"
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </form>
        </div>
        </div>
    );
}
