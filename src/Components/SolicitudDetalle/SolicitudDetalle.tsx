import React from 'react';
import { IonIcon } from "@ionic/react";
import { closeOutline, checkmarkCircle, closeCircle } from "ionicons/icons";

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

interface SolicitudDetalleProps {
    solicitud: Solicitud | null;
    isOpen: boolean;
    loading?: boolean;
    onClose: () => void;
    onAprobarItem: (itemId: string) => void;
    onRechazarItem: (itemId: string) => void;
}

export const SolicitudDetalle: React.FC<SolicitudDetalleProps> = ({
    solicitud,
    isOpen,
    loading = false,
    onClose,
    onAprobarItem,
    onRechazarItem
}) => {
    if (!isOpen || !solicitud) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Detalle de Solicitud #{solicitud.nroSolicitud}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Solicitante: {solicitud.solicitante || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Estado: <span className={`px-2 py-1 rounded text-xs font-bold ${
                                solicitud.estado === 'pendiente' 
                                    ? 'bg-yellow-200 text-yellow-800'
                                    : solicitud.estado === 'aprobado'
                                    ? 'bg-green-200 text-green-800'
                                    : 'bg-red-200 text-red-800'
                            }`}>
                                {solicitud.estado || 'Sin estado'}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2"
                        title="Cerrar"
                    >
                        <IonIcon icon={closeOutline} className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {/* Observaciones */}
                    {solicitud.observaciones && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Observaciones</h3>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded">
                                {solicitud.observaciones}
                            </p>
                        </div>
                    )}

                    {/* Tabla de detalles */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Items</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Nro de Solicitud
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Tipo de Equipamiento
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Producto
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Cantidad
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                                                    Cargando detalles...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : solicitud.detalles && solicitud.detalles.length > 0 ? (
                                        solicitud.detalles.map((item, index) => (
                                            <tr key={item._id || item.id || index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                    {solicitud.nroSolicitud}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                    {typeof item.tipoEquipamiento === 'object' && item.tipoEquipamiento?.nombre 
                                                        ? item.tipoEquipamiento.nombre 
                                                        : typeof item.tipoEquipamiento === 'string' 
                                                        ? item.tipoEquipamiento 
                                                        : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                    {typeof item.producto === 'object' && item.producto?.nombre 
                                                        ? item.producto.nombre 
                                                        : typeof item.producto === 'string' 
                                                        ? item.producto 
                                                        : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                    {item.cantidad || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center border-b">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        item.estado === 'aprobado' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : item.estado === 'rechazado'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {item.estado || 'pendiente'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center border-b">
                                                    <div className="flex justify-center space-x-2">
                                                        {solicitud.estado === 'pendiente' ? (
                                                            <>
                                                                {item.estado !== 'aprobado' && (
                                                                    <button
                                                                        onClick={() => onAprobarItem(item._id || item.id || '')}
                                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                                        title="Aprobar producto"
                                                                    >
                                                                        <IonIcon icon={checkmarkCircle} className="w-4 h-4 mr-1" />
                                                                        Aprobar
                                                                    </button>
                                                                )}
                                                                {item.estado !== 'rechazado' && (
                                                                    <button
                                                                        onClick={() => onRechazarItem(item._id || item.id || '')}
                                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                                        title="Rechazar producto"
                                                                    >
                                                                        <IonIcon icon={closeCircle} className="w-4 h-4 mr-1" />
                                                                        Rechazar
                                                                    </button>
                                                                )}
                                                                {(item.estado === 'aprobado' || item.estado === 'rechazado') && (
                                                                    <span className="text-xs text-gray-500 py-1">
                                                                        {item.estado === 'aprobado' ? 'Ya aprobado' : 'Ya rechazado'}
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-gray-500 py-1">
                                                                {solicitud.estado === 'aprobado' ? 'Solicitud aprobada' : 'Solicitud rechazada'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                {!loading && (!solicitud.detalles || solicitud.detalles.length === 0) 
                                                    ? 'No hay detalles disponibles para esta solicitud'
                                                    : ''
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolicitudDetalle;
