import { useState, useEffect } from 'react';
import axios from 'axios';
import { trashOutline, checkmarkCircle, createOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import SolicitudDetalle from '../../../../Components/SolicitudDetalle/SolicitudDetalle';
import { Toast, showApprovalToast, showRejectionToast, showErrorToast, showInfoToast } from '../../../../Components/Toast';
import { useAuth } from '../../../../Library/Context/AuthContext';

interface DetalleItem {
    _id?: string;
    id?: string;
    solicitudId?: string;
    nroSolicitud?: string;
    producto?: {
        _id?: string;
        nombre?: string;
        descripcion?: string;
    } | string;
    tipoEquipamiento?: {
        _id?: string;
        nombre?: string;
        descripcion?: string;
    } | string;
    cantidad?: number;
    cantidadAprobada?: number;
    cantidadEntregada?: number;
    precioEstimado?: number;
    precioReal?: number;
    estado?: string;
    proveedor?: {
        _id?: string;
        nombre?: string;
    } | string | null;
    garantia?: string | null;
    fechaCreacion?: string;
    fechaModificacion?: string;
}

interface Solicitud {
    _id?: string;
    id?: string;
    nroSolicitud?: string;
    solicitante?: string;
    cargoSolicitante?: string;
    beneficiario?: string;
    gerencia?: {
        _id?: string;
        nombre?: string;
    } | string;
    emailSolicitante?: string;
    telefonoSolicitante?: string;
    telefonoBeneficiario?: string;
    cuentaBeneficiario?: string;
    observaciones?: string;
    estado?: string;
    fechaCreacion?: string;
    createdAt?: string;
    fechaModificacion?: string;
    fechaAprobacion?: string | null;
    fechaRechazo?: string | null;
    fechaEntrega?: string | null;
    fechaVencimiento?: string | null;
    usuarioCreador?: string;
    usuarioModificador?: string;
    usuarioAprobador?: string | null;
    usuarioRechazador?: string | null;
    detalles?: DetalleItem[];
}
export default function SolicitudView() {
    const { accessToken, isAuthenticated } = useAuth();
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
    const [isDetalleOpen, setIsDetalleOpen] = useState(false);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                setLoading(true);
                
                if (!isAuthenticated || !accessToken) {
                    showErrorToast("Usuario no autenticado. Por favor, inicie sesión");
                    return;
                }
                
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/solicitud/solicitudes`, {}, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSolicitudes(response.data.data);
            } catch (error: unknown) {
                console.error('Error fetching solicitudes:', error);
                
                // Type guard para errores de Axios
                interface AxiosErrorResponse {
                    response?: {
                        status?: number;
                    };
                    code?: string;
                }
                
                const isAxiosError = (err: unknown): err is AxiosErrorResponse => {
                    return typeof err === 'object' && err !== null && ('response' in err || 'code' in err);
                };
                
                // Manejar diferentes tipos de errores de manera más amigable
                if (isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        showErrorToast("No se encontraron solicitudes");
                    } else if (error.response?.status === 401) {
                        showErrorToast("No tiene permisos para ver las solicitudes");
                    } else if (error.response?.status === 500) {
                        showErrorToast("Error interno del servidor. Intente nuevamente");
                    } else if (error.code === 'NETWORK_ERROR') {
                        showErrorToast("Error de conexión. Verifique su conexión a internet");
                    } else {
                        showErrorToast("Error al cargar las solicitudes. Intente nuevamente");
                    }
                } else {
                    showErrorToast("Error al cargar las solicitudes. Intente nuevamente");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
    }, [accessToken, isAuthenticated]);

    const handleVerDetalle = async (solicitud: Solicitud) => {
        try {
            setSelectedSolicitud(solicitud);
            setIsDetalleOpen(true);
            setLoadingDetalle(true);
            
            // Hacer llamada al endpoint para obtener los detalles
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/solicitud/detalle`, {
                id: solicitud._id || solicitud.id
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Actualizar la solicitud seleccionada con los detalles obtenidos
            const solicitudConDetalles = {
                ...solicitud,
                detalles: response.data.data
            };
            
            setSelectedSolicitud(solicitudConDetalles);
        } catch (error) {
            // Mostrar mensaje de error pero mantener el popup abierto
            showErrorToast(`Error al obtener detalles de la solicitud: ${error}`);
        } finally {
            setLoadingDetalle(false);
        }
    };

    const handleCloseDetalle = () => {
        setIsDetalleOpen(false);
        setSelectedSolicitud(null);
    };

    const handleAprobarSolicitud = async (solicitud: Solicitud) => {
        try {
            // Aprobar toda la solicitud y todos sus productos
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/solicitud/aprobar`, {
                id: solicitud._id || solicitud.id
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.codigo === 200) {
                // Actualizar el estado local de la solicitud
                setSolicitudes(prevSolicitudes => 
                    prevSolicitudes.map(s => 
                        s._id === solicitud._id 
                            ? { ...s, estado: 'aprobado' }
                            : s
                    )
                );
                showApprovalToast(`Solicitud aprobada exitosamente: ${response.data.mensaje || ''}`);
            }
        } catch (error) {
            showErrorToast(`Error al aprobar solicitud: ${error}`);
            alert('Error al aprobar la solicitud');
        }
    };

    const handleRechazarSolicitud = async (solicitud: Solicitud) => {
        try {
            // Confirmar acción
            if (!confirm('¿Está seguro de rechazar toda la solicitud? Esta acción no se puede deshacer.')) {
                return;
            }

            // Rechazar toda la solicitud y todos sus productos
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/solicitud/rechazar`, {
                id: solicitud._id || solicitud.id
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.codigo === 200) {
                // Actualizar el estado local de la solicitud
                setSolicitudes(prevSolicitudes => 
                    prevSolicitudes.map(s => 
                        s._id === solicitud._id 
                            ? { ...s, estado: 'rechazado' }
                            : s
                    )
                );
                showRejectionToast(`Solicitud rechazada exitosamente ${response.data.data}`);
            }
        } catch (error) {
            showErrorToast(`Error al rechazar solicitud: ${error}`);
            alert('Error al rechazar la solicitud');
        }
    };

    const handleAprobarItem = async (itemId: string) => {
        try {
            // Aprobar un producto específico
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/solicitud/item/aprobar`, {
                id: itemId
            },{
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.codigo === 200) {
                // Actualizar el detalle en la solicitud seleccionada
                if (selectedSolicitud) {
                    const solicitudActualizada = {
                        ...selectedSolicitud,
                        detalles: selectedSolicitud.detalles?.map(detalle => 
                            detalle._id === itemId 
                                ? { ...detalle, estado: 'aprobado' }
                                : detalle
                        )
                    };
                    
                    // Verificar si hay al menos un producto aprobado para cambiar estado de solicitud
                    const tieneAprobados = solicitudActualizada.detalles?.some(d => d.estado === 'aprobado');
                    if (tieneAprobados) {
                        solicitudActualizada.estado = 'aprobado';
                        
                        // Actualizar también en la lista principal
                        setSolicitudes(prevSolicitudes => 
                            prevSolicitudes.map(s => 
                                s._id === selectedSolicitud._id 
                                    ? { ...s, estado: 'aprobado' }
                                    : s
                            )
                        );
                    }
                    
                    setSelectedSolicitud(solicitudActualizada);
                }
                showInfoToast(`Producto aprobado exitosamente ${response.data.data}`);
            }
        } catch (error) {
            showErrorToast(`Error al aprobar producto: ${error}`);
            alert('Error al aprobar el producto');
        }
    };

    const handleRechazarItem = async (itemId: string) => {
        try {
            // Confirmar acción
            if (!confirm('¿Está seguro de rechazar este producto?')) {
                return;
            }

            // Rechazar un producto específico
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/solicitud/item/rechazar`, {
                id: itemId
            },{
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.codigo === 200) {
                // Actualizar el detalle en la solicitud seleccionada
                if (selectedSolicitud) {
                    const solicitudActualizada = {
                        ...selectedSolicitud,
                        detalles: selectedSolicitud.detalles?.map(detalle => 
                            detalle._id === itemId 
                                ? { ...detalle, estado: 'rechazado' }
                                : detalle
                        )
                    };
                    
                    // Verificar si todos los productos están rechazados
                    const todosRechazados = solicitudActualizada.detalles?.every(d => d.estado === 'rechazado');
                    if (todosRechazados) {
                        solicitudActualizada.estado = 'rechazado';
                        
                        // Actualizar también en la lista principal
                        setSolicitudes(prevSolicitudes => 
                            prevSolicitudes.map(s => 
                                s._id === selectedSolicitud._id 
                                    ? { ...s, estado: 'rechazado' }
                                    : s
                            )
                        );
                    }
                    
                    setSelectedSolicitud(solicitudActualizada);
                }
                showInfoToast(`Producto rechazado exitosamente ${response.data.data}`);
            }
        } catch (error) {
            showErrorToast(`Error al rechazar producto: ${error}`);
            alert('Error al rechazar el producto');
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">Vista de Solicitud</h1>
            {/* Aquí puedes agregar más componentes o lógica para manejar la validación de solicitudes */}
            <Toast autoClose={3000} theme="dark" className="custom-toast"/>
            <table className="border-collapse w-full">
                <thead>
                    <tr>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">NRO Solicitud</th>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Descripción</th>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden xl:table-cell">Estado</th>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden 2xl:table-cell">Fecha Creación</th>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={3} className="p-3 text-center text-gray-600 xl:hidden">
                                Cargando solicitudes...
                            </td>
                            <td colSpan={4} className="p-3 text-center text-gray-600 hidden xl:table-cell 2xl:hidden">
                                Cargando solicitudes...
                            </td>
                            <td colSpan={5} className="p-3 text-center text-gray-600 hidden 2xl:table-cell">
                                Cargando solicitudes...
                            </td>
                        </tr>
                    ) : solicitudes.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="p-3 text-center text-gray-600 xl:hidden">
                                No hay solicitudes disponibles
                            </td>
                            <td colSpan={4} className="p-3 text-center text-gray-600 hidden xl:table-cell 2xl:hidden">
                                No hay solicitudes disponibles
                            </td>
                            <td colSpan={5} className="p-3 text-center text-gray-600 hidden 2xl:table-cell">
                                No hay solicitudes disponibles
                            </td>
                        </tr>
                    ) : (
                        solicitudes.map((solicitud: Solicitud, index: number) => (
                            <tr key={solicitud._id || index} className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
                                <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">NRO Solicitud</span>
                                    {solicitud.nroSolicitud || solicitud.nroSolicitud || 'N/A'}
                                </td>
                                <td className="w-full lg:w-auto p-3 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Observación</span>
                                    <span className="text-xs 2xl:text-sm">
                                        {solicitud.observaciones || solicitud.observaciones || 'Sin descripción'}
                                    </span>
                                </td>
                                <td className="w-full xl:w-auto p-3 text-gray-800 border border-b text-center hidden xl:table-cell relative xl:static">
                                    <span className="xl:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Estado</span>
                                    <span className={`rounded py-1 px-3 text-xs font-bold ${
                                        solicitud.estado === 'activo' || solicitud.estado === 'pendiente' 
                                            ? 'bg-yellow-400' 
                                            : solicitud.estado === 'aprobado'
                                            ? 'bg-green-400'
                                            : 'bg-red-400'
                                    }`}>
                                        {solicitud.estado || 'Sin estado'}
                                    </span>
                                </td>
                                <td className="w-full 2xl:w-auto p-3 text-gray-800 border border-b text-center hidden 2xl:table-cell relative 2xl:static">
                                    <span className="2xl:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Fecha Creación</span>
                                    {solicitud.fechaCreacion 
                                        ? new Date(solicitud.fechaCreacion).toLocaleDateString() 
                                        : solicitud.createdAt 
                                        ? new Date(solicitud.createdAt).toLocaleDateString()
                                        : 'N/A'
                                    }
                                </td>
                                <td className="w-full lg:w-auto p-3 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Acciones</span>
                                    <button
                                        onClick={() => handleVerDetalle(solicitud)}
                                        className="inline-flex items-center px-3 mr-2 py-1 border border-transparent text-xs font-medium rounded-md text-blue bg-yellow-400 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                                        title="Detalle"
                                    >
                                        <IonIcon icon={createOutline} className="w-4 h-4 xl:mr-1" />
                                        <span className="hidden xl:inline">Detalle</span>
                                    </button>
                                    {solicitud.estado === 'pendiente' && (
                                        <>
                                            <button
                                                onClick={() => handleRechazarSolicitud(solicitud)}
                                                className="inline-flex items-center px-3 mr-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                title="Rechazar solicitud"
                                            >
                                                <IonIcon icon={trashOutline} className="w-4 h-4 xl:mr-1" />
                                                <span className="hidden xl:inline">Rechazar</span>
                                            </button>
                                            <button
                                                onClick={() => handleAprobarSolicitud(solicitud)}
                                                className="inline-flex items-center px-3 mr-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                title="Aprobar solicitud"
                                            >
                                                <IonIcon icon={checkmarkCircle} className="w-4 h-4 xl:mr-1" />
                                                <span className="hidden xl:inline">Aprobar</span>
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            
            {/* Popup de detalle de solicitud */}
            <SolicitudDetalle
                solicitud={selectedSolicitud}
                isOpen={isDetalleOpen}
                loading={loadingDetalle}
                onClose={handleCloseDetalle}
                onAprobarItem={handleAprobarItem}
                onRechazarItem={handleRechazarItem}
            />
        </div>
    )
}
