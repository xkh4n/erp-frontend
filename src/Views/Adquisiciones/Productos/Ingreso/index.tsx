import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CustomError } from "../../../../Library/Errores";
import { 
    validateProductForm, 
    sanitizeString, 
    rateLimiter 
} from "../../../../Library/Security/validation";


type ErrorState = {
    code: number;
    message: string;
    detail: string;
};


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
    centroCosto?: string;
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

export default function IngresoProducto() {
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState<Solicitud[]>([]);
    const [detalleSolicitud, setDetalleSolicitud] = useState<DetalleSolicitud[]>([]);
    
    // Estados para el popup de recepción
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProductoRecepcion, setSelectedProductoRecepcion] = useState<DetalleSolicitud | null>(null);
    const [numeroSerie, setNumeroSerie] = useState("");
    
    // Estados para el control de recepciones
    const [detalleRecepciones, setDetalleRecepciones] = useState<DetalleRecepcion[]>([]);
    
    // Estados para el formulario
    const [selectedProveedor, setSelectedProveedor] = useState("");
    const [selectedProducto, setSelectedProducto] = useState("");
    const [selectedSolicitud, setSelectedSolicitud] = useState("");
    const [nroSerie, setNroSerie] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [paisId, setPaisId] = useState("");
    const [ciudadId, setCiudadId] = useState("");
    const [comunaId, setComunaId] = useState("");
    const [direccion, setDireccion] = useState("");
    const [contacto, setContacto] = useState("");
    const [fonoContacto, setFonoContacto] = useState("");
    const [tipoServicio, setTipoServicio] = useState("");
    const [estado, setEstado] = useState("");
    const [condicionesPago, setCondicionesPago] = useState("");
    const [condicionesEntrega, setCondicionesEntrega] = useState("");
    const [condicionesDespacho, setCondicionesDespacho] = useState("");
    
    // Estados para validación
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/solicitud/aprobadas`
                );
                setSolicitud(response.data.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchSolicitudes();
    }, [navigate]);

    // Función para manejar el cambio de solicitud
    const handleSolicitudChange = async (solicitudId: string) => {
        setSelectedSolicitud(solicitudId);
        
        if (solicitudId) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/solicitud/detalle/recepcion`,
                    { id: solicitudId }
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

    // Función para obtener la cantidad pendiente de un producto (basado en recepciones locales)
    const getCantidadPendiente = (productoId: string): number => {
        const detalle = detalleSolicitud.find(d => d.productoId === productoId);
        if (!detalle) {
            toast.error(`No se encontró detalle para el producto: ${productoId}`, {
                position: "top-right",
                autoClose: 3000,
            });
            return 0;
        }
        // Contar recepciones locales para este producto (incluye backend + locales)
        const recepcionesProducto = detalleRecepciones.filter(r => r.productoId === productoId);
        const cantidadPendiente = Math.max(0, detalle.cantidad - recepcionesProducto.length);
        return cantidadPendiente;
    };

    // Función para verificar si un producto está completamente recibido
    const isProductoCompletamenteRecibido = (productoId: string): boolean => {
        return getCantidadPendiente(productoId) === 0;
    };

    // Función para verificar si la solicitud estará completa después de guardar las recepciones locales
    const verificarSiSolicitudSeCompleta = (): boolean => {
        // Verificar si todos los productos tendrán cantidad pendiente = 0 después de guardar
        return detalleSolicitud.every(detalle => {
            const cantidadPendiente = getCantidadPendiente(detalle.productoId);
            // Si ya no tiene pendientes o si las recepciones locales lo completarán
            return cantidadPendiente === 0;
        });
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
    };    const handleAceptarRecepcion = () => {
        if (!selectedProductoRecepcion || !numeroSerie.trim()) {
            toast.error("Por favor complete el número de serie", {
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
            r.numeroSerie.toLowerCase() === numeroSerie.trim().toLowerCase()
        );
        if (serieExistente) {
            toast.error("El número de serie ya está registrado en otra recepción", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Crear nueva recepción local (el código de inventario se generará automáticamente en el backend)
        const nuevaRecepcion: DetalleRecepcion = {
            productoId: selectedProductoRecepcion.productoId,
            producto: selectedProductoRecepcion.producto,
            numeroSerie: numeroSerie.trim(),
            numeroDocumento: "PENDIENTE", // Se generará automáticamente en el backend
            fechaRecepcion: new Date().toISOString()
        };

        // Agregar al estado local
        setDetalleRecepciones(prev => {
            const nuevasRecepciones = [...prev, nuevaRecepcion];
            return nuevasRecepciones;
        });

        handleClosePopup();
        
        const nuevaCantidadPendiente = cantidadPendiente - 1;
        if (nuevaCantidadPendiente === 0) {
            toast.success(`¡Producto "${selectedProductoRecepcion.producto}" completamente recibido!`, {
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            toast.success(`Producto agregado localmente. Pendientes: ${nuevaCantidadPendiente}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };



    const handlerSubmit = async () => {
        // Verificar rate limiting
        if (!rateLimiter.isAllowed('form-submit')) {
            toast.error("Demasiados intentos. Por favor espere un momento antes de intentar nuevamente.", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        setIsSubmitting(true);
        setValidationErrors([]);

        try {
            // Crear objeto con datos del formulario
            const formData = {
                selectedSolicitud: sanitizeString(selectedSolicitud),
                selectedProveedor: sanitizeString(selectedProveedor),
                selectedProducto: sanitizeString(selectedProducto),
                nroSerie: sanitizeString(nroSerie),
                telefono: sanitizeString(telefono),
                email: sanitizeString(email),
                direccion: sanitizeString(direccion),
                contacto: sanitizeString(contacto),
                fonoContacto: sanitizeString(fonoContacto),
                condicionesPago: sanitizeString(condicionesPago),
                condicionesEntrega: sanitizeString(condicionesEntrega),
                condicionesDespacho: sanitizeString(condicionesDespacho),
            };

            // Preparar datos para envío al backend
            const dataToSend = {
                solicitudId: selectedSolicitud,
                proveedorId: selectedProveedor,
                productoId: selectedProducto,
                nroSerie: nroSerie.toUpperCase(),
                telefono,
                email: email.toLowerCase(),
                paisId: paisId || null,
                ciudadId: ciudadId || null,
                comunaId: comunaId || null,
                direccion,
                contacto,
                fonoContacto,
                tipoServicio: tipoServicio || null,
                estado: estado === 'true',
                condicionesPago,
                condicionesEntrega,
                condicionesDespacho,
                fechaCreacion: new Date().toISOString()
            };

                        // Validar formulario
            const validation = validateProductForm(formData);
            
            if (!validation.isValid) {
                setValidationErrors(validation.errors);
                toast.error(`Errores de validación: ${validation.errors.join(', ')}`, {
                    position: "top-right",
                    autoClose: 8000,
                });
                return;
            }


            // Enviar al backend con headers de seguridad
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/producto/ingreso`,
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest', // Prevenir CSRF básico
                    },
                    timeout: 10000, // Timeout de 10 segundos
                }
            );

            if (response.data.codigo === 200) {
                toast.success("¡Producto guardado exitosamente!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });

                // Limpiar formulario después del éxito
                setSelectedSolicitud("");
                setSelectedProveedor("");
                setSelectedProducto("");
                setNroSerie("");
                setTelefono("");
                setEmail("");
                setPaisId("");
                setCiudadId("");
                setComunaId("");
                setDireccion("");
                setContacto("");
                setFonoContacto("");
                setTipoServicio("");
                setEstado("");
                setCondicionesPago("");
                setCondicionesEntrega("");
                setCondicionesDespacho("");
            } else {
                throw new Error(response.data.mensaje || 'Error desconocido del servidor');
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    toast.error("Tiempo de espera agotado. Por favor intente nuevamente.", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } else if (error.response?.status === 429) {
                    toast.error("Demasiadas solicitudes. Por favor espere antes de intentar nuevamente.", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } else if (error.response?.status === 400) {
                    toast.error(`Error de validación: ${error.response.data.mensaje || 'Datos inválidos'}`, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } else {
                    toast.error(`Error de conexión: ${error.message}`, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
            } else if (error instanceof Error) {
                toast.error(`Error: ${error.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            } else {
                toast.error("Error desconocido al procesar la solicitud", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    // Función para guardar todas las recepciones locales al backend
    const handlerGuardarRecepciones = async () => {
        if (detalleRecepciones.length === 0) {
            toast.warning("No hay recepciones para guardar", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (!selectedSolicitud) {
            toast.error("No se ha seleccionado una solicitud", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Filtrar solo las recepciones que no están en el backend (las que son locales)
            const recepcionesBackend = detalleSolicitud.flatMap(d => 
                (d.recepciones || []).map(r => r.numeroSerie)
            );
            
            const recepcionesLocales = detalleRecepciones.filter(r => 
                !recepcionesBackend.includes(r.numeroSerie)
            );

            if (recepcionesLocales.length === 0) {
                toast.info("Todas las recepciones ya están guardadas", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setIsSubmitting(false);
                return;
            }

            let exitosas = 0;
            let errores = 0;

            // Calcular si esta será la última recepción que complete la solicitud
            const esSolicitudCompleta = verificarSiSolicitudSeCompleta();

            // Enviar cada recepción individual al backend
            for (const recepcion of recepcionesLocales) {
                try {
                    // Determinar si esta es la última recepción a enviar
                    const esUltimaRecepcion = recepcionesLocales.indexOf(recepcion) === recepcionesLocales.length - 1;
                    
                    const dataToSend = {
                        solicitudId: selectedSolicitud,
                        producto: recepcion.productoId,
                        numeroSerie: recepcion.numeroSerie,
                        esSolicitudCompleta: esSolicitudCompleta && esUltimaRecepcion
                        // Solo enviar true en la última recepción si la solicitud se completa
                    };

                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/solicitud/recepcion/procesar`,
                        dataToSend,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                            timeout: 10000,
                        }
                    );

                    if (response.data.codigo === 200) {
                        exitosas++;
                    } else {
                        errores++;
                        toast.error(`Error al guardar recepción ${recepcion.numeroSerie}: ${response.data.mensaje}`, {
                            position: "top-right",
                            autoClose: 5000,
                        });
                    }
                } catch (error) {
                    errores++;
                    toast.error(`Error al guardar recepción ${recepcion.numeroSerie}: ${error instanceof Error ? error.message : 'Error desconocido'}`, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
            }

            // Mostrar resultado final
            if (errores === 0) {
                toast.success(`¡Todas las recepciones (${exitosas}) se guardaron exitosamente!`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            } else if (exitosas > 0) {
                toast.warning(`Se guardaron ${exitosas} recepciones. ${errores} fallaron.`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            } else {
                toast.error(`No se pudo guardar ninguna recepción. ${errores} errores.`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            }

            // Recargar los datos desde el backend para sincronizar
            await handleSolicitudChange(selectedSolicitud);

            // Verificar si la solicitud se completó y actualizar lista de solicitudes
            try {
                const solicitudesResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/solicitud/aprobadas`
                );
                setSolicitud(solicitudesResponse.data.data);
                
                // Si la solicitud ya no está en la lista (se completó), limpiar selección
                const solicitudActualExiste = solicitudesResponse.data.data.find((s: Solicitud) => s._id === selectedSolicitud);
                if (!solicitudActualExiste) {
                    toast.info("¡Solicitud completamente recibida! La solicitud ha sido marcada como 'recibida' y no aparecerá más en la lista.", {
                        position: "top-right",
                        autoClose: 6000,
                    });
                    
                    // Esperar un momento para que el usuario vea el mensaje y luego recargar
                    setTimeout(() => {
                        navigate("/ingresos");
                    }, 2000);
                } else {
                    // Si la solicitud aún existe pero se guardaron recepciones, también recargar para actualizar
                    if (exitosas > 0) {
                        setTimeout(() => {
                            navigate("/ingresos");
                        }, 1500);
                    }
                }
            } catch (error) {
                console.warn("Error al actualizar lista de solicitudes:", error);
                // Aunque haya error al verificar, si se guardaron recepciones exitosamente, recargar
                if (exitosas > 0) {
                    setTimeout(() => {
                        navigate("/ingresos");
                    }, 2000);
                }
            }

        } catch (error) {
            toast.error(`Error inesperado al guardar las recepciones. ${error}`, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Manejo de errores genérico
    // Esta función maneja los errores y redirige a una página de error con el estado adecuado
    function handleError(
        error: unknown,
        navigate: (path: string, options?: { state: ErrorState }) => void
    ) {
        if (error instanceof CustomError) {
            const errorData = error.toJSON();
            navigate("/error", {
                state: {
                code: errorData.code,
                message: errorData.message,
                detail: errorData.details
                }
            });
        } else if (error instanceof axios.AxiosError) {
            navigate("/error", {
                state: {
                code: error.response?.status || 500,
                message: error.message || "Network Error",
                detail: error.response?.statusText || "Unknown error"
                }
            });
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
        <ToastContainer aria-label="Notificaciones de la aplicación" />
        <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
                Ingreso de Producto
            </h1>
            
            {/* Mensaje explicativo del flujo de trabajo */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <span className="text-blue-500 text-xl">ℹ️</span>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Flujo de Recepción de Productos</h3>
                        <div className="text-sm text-blue-700">
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Selecciona una <strong>solicitud aprobada</strong></li>
                                <li>Haz clic en <strong>"Recibir"</strong> para cada producto</li>
                                <li>Ingresa el <strong>número de serie</strong> (el código de inventario se genera automáticamente)</li>
                                <li>Usa el botón <strong>"Guardar Recepciones"</strong> para confirmar todas las recepciones</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
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
                                            <p className="text-blue-800">{solicitudSeleccionada.centroCosto}</p>
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
                                    const cantidadPendiente = getCantidadPendiente(detalle.productoId);
                                    const cantidadRecibida = detalle.cantidad - cantidadPendiente;
                                    const estaCompleto = isProductoCompletamenteRecibido(detalle.productoId);
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
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Recepción de Producto</h3>
                            <div className="mt-4 text-left">
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Producto:</strong> {selectedProductoRecepcion.producto}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Cantidad Total:</strong> {selectedProductoRecepcion.cantidad}
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    <strong>Pendiente por Recibir:</strong> 
                                    <span className="ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {getCantidadPendiente(selectedProductoRecepcion.productoId)}
                                    </span>
                                </p>
                                
                                {/* Mostrar recepciones anteriores si existen */}
                                {(() => {
                                    const recepcionesProducto = detalleRecepciones.filter(r => r.productoId === selectedProductoRecepcion.productoId);
                                    return recepcionesProducto.length > 0 && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Recepciones Realizadas ({recepcionesProducto.length}):</p>
                                            <div className="max-h-24 overflow-y-auto">
                                                {recepcionesProducto.map((recepcion, index) => (
                                                    <div key={index} className="text-xs text-gray-600 mb-1">
                                                        <span className="font-medium">Serie:</span> {recepcion.numeroSerie} | 
                                                        <span className="font-medium"> Doc:</span> {recepcion.numeroDocumento}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numeroSerie">
                                        Número de Serie
                                    </label>
                                    <input
                                        id="numeroSerie"
                                        type="text"
                                        value={numeroSerie}
                                        onChange={(e) => setNumeroSerie(e.target.value.toUpperCase())}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ingrese el número de serie"
                                    />
                                </div>
                                
                                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                                    <p className="text-sm text-blue-700">
                                        <strong>📦 Código de Inventario:</strong> Se generará automáticamente un código único entre 100,000,000 y 999,999,999 que podrá ser usado como código de barras.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={handleClosePopup}
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAceptarRecepcion}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Mostrar errores de validación */}
            {validationErrors.length > 0 && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h4 className="font-bold">Errores de validación:</h4>
                    <ul className="list-disc list-inside">
                        {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Botón Guardar principal - Solo mostrar si no hay recepciones o si hay datos del formulario principal */}
            {(detalleRecepciones.length === 0 || selectedProveedor || selectedProducto || nroSerie) && (
                <div className="flex flex-1 row-auto justify-center">
                    <button
                        type="button"
                        onClick={handlerSubmit}
                        disabled={isSubmitting}
                        className={`flex justify-center mt-5 items-center ${
                            isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-950 hover:bg-red-600 hover:shadow-blue-800/50 shadow-red-600/50'
                        } text-white focus:outline-none focus:ring py-2 w-60 rounded-full shadow-xl transition delay-10 duration-300 ease-in-out hover:translate-y-1`}
                    >
                        <IonIcon icon={saveOutline} className="w-5 h-5" />
                        <p className="ml-1 text-lg">
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </p>
                    </button>
                </div>
            )}

            {/* Botón para guardar recepciones si hay recepciones locales */}
            {detalleRecepciones.length > 0 && (
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={handlerGuardarRecepciones}
                        disabled={isSubmitting}
                        className={`flex items-center ${
                            isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/50'
                        } text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-200 text-lg`}
                    >
                        <IonIcon icon={saveOutline} className="w-6 h-6 mr-2" />
                        {isSubmitting ? 'Guardando Recepciones...' : `💾 Guardar Recepciones (${detalleRecepciones.length})`}
                    </button>
                    
                    {/* Mensaje informativo */}
                    <div className="ml-4 flex items-center">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-yellow-400">⚠️</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Tienes <strong>{detalleRecepciones.length}</strong> recepciones pendientes de guardar en el sistema.
                                    </p>
                                </div>
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
