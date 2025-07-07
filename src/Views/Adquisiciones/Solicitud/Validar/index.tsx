import { useState, useEffect } from 'react';
import axios from 'axios';
import { trashOutline, checkmarkCircle, createOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import SolicitudDetalle from '../../../../Components/SolicitudDetalle/SolicitudDetalle';

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
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
    const [isDetalleOpen, setIsDetalleOpen] = useState(false);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/solicitud/solicitudes`);
                setSolicitudes(response.data.data);
                console.table(response.data.data);
            } catch (error) {
                console.error("Error fetching solicitudes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
    }, []);

    const handleVerDetalle = async (solicitud: Solicitud) => {
        try {
            setSelectedSolicitud(solicitud);
            setIsDetalleOpen(true);
            setLoadingDetalle(true);
            
            // Hacer llamada al endpoint para obtener los detalles
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/solicitud/detalle`, {
                id: solicitud._id || solicitud.id
            });
            
            // Actualizar la solicitud seleccionada con los detalles obtenidos
            const solicitudConDetalles = {
                ...solicitud,
                detalles: response.data.data
            };
            
            setSelectedSolicitud(solicitudConDetalles);
        } catch (error) {
            console.error('Error al obtener detalles de la solicitud:', error);
            // Mostrar mensaje de error pero mantener el popup abierto
            alert('Error al cargar los detalles de la solicitud');
        } finally {
            setLoadingDetalle(false);
        }
    };

    const handleCloseDetalle = () => {
        setIsDetalleOpen(false);
        setSelectedSolicitud(null);
    };

    const handleAprobarItem = async (itemId: string) => {
        try {
            // Aquí puedes agregar la lógica para aprobar un item específico
            console.log('Aprobando item:', itemId);
            // Ejemplo de llamada a la API:
            // await axios.put(`${import.meta.env.VITE_API_URL}/solicitud/item/${itemId}/aprobar`);
            // Actualizar el estado o recargar los datos
        } catch (error) {
            console.error('Error al aprobar item:', error);
        }
    };

    const handleRechazarItem = async (itemId: string) => {
        try {
            // Aquí puedes agregar la lógica para rechazar un item específico
            console.log('Rechazando item:', itemId);
            // Ejemplo de llamada a la API:
            // await axios.put(`${import.meta.env.VITE_API_URL}/solicitud/item/${itemId}/rechazar`);
            // Actualizar el estado o recargar los datos
        } catch (error) {
            console.error('Error al rechazar item:', error);
        }
    };
    return (
        <div>
            <h1>Vista de Solicitud</h1>
            <p>Aquí puedes validar y gestionar las solicitudes.</p>
            {/* Aquí puedes agregar más componentes o lógica para manejar la validación de solicitudes */}
            <table className="border-collapse w-full">
                <thead>
                    <tr>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">NRO Solicitud</th>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Descripción</th>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Estado</th>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Fecha Creación</th>
                        <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="p-3 text-center text-gray-600">
                                Cargando solicitudes...
                            </td>
                        </tr>
                    ) : solicitudes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-3 text-center text-gray-600">
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
                                <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Observación</span>
                                    {solicitud.observaciones || solicitud.observaciones || 'Sin descripción'}
                                </td>
                                <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Estado</span>
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
                                <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Fecha Creación</span>
                                    {solicitud.fechaCreacion 
                                        ? new Date(solicitud.fechaCreacion).toLocaleDateString() 
                                        : solicitud.createdAt 
                                        ? new Date(solicitud.createdAt).toLocaleDateString()
                                        : 'N/A'
                                    }
                                </td>
                                <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Acciones</span>
                                    <button
                                        onClick={() => handleVerDetalle(solicitud)}
                                        className="inline-flex items-center px-3 mr-2 py-1 border border-transparent text-xs font-medium rounded-md text-blue bg-yellow-400 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        title="Detalle"
                                    >
                                        <IonIcon icon={createOutline} className="w-4 h-4 mr-1" />
                                        Detalle
                                    </button>
                                    <button
                                        className="inline-flex items-center px-3 mr-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        title="Eliminar elemento"
                                    >
                                        <IonIcon icon={trashOutline} className="w-4 h-4 mr-1" />
                                        Rechazar
                                    </button>
                                    <button
                                        className="inline-flex items-center px-3 mr-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        title="Eliminar elemento"
                                    >
                                        <IonIcon icon={checkmarkCircle} className="w-4 h-4 mr-1" />
                                        Aprobar
                                    </button>
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
