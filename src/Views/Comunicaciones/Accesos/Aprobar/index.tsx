import { useEffect, useState } from "react"
import { useAccesosSalas, useAuth } from "../../../../Library/Hooks"
import { trashOutline, checkmarkCircle } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { Toast, showApprovalToast, showRejectionToast, showErrorToast } from '../../../../Components/Toast';
import axios from "axios";


function AprobarAcceso() {
    const { user, accessToken, isAuthenticated } = useAuth();
    const { accesosPendientes, refetch } = useAccesosSalas();
    const [aprobador, setAprobador] = useState('');
    const [idAprobador, setIdAprobador] = useState('');

    // Establecer automáticamente el nombre del usuario al cargar el componente
    useEffect(() => {
        if (user && (user.nombre || user.name || user.username)) {
            setAprobador(user.nombre || user.name || user.username);
            setIdAprobador(user.id);
        }
    }, [isAuthenticated, accessToken, user]);

    const handleEstadoSolicitud = async (id: string, estado: 'aprobado' | 'rechazado') => {
        const dataSend = {
            "solicitud": id,
            "aprobador": idAprobador,
            "estado": estado
        };
        
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/acceso/actualizar`, dataSend, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                timeout: 3000
            });
            
            // Mostrar toast según el estado
            if (estado === 'aprobado') {
                showApprovalToast('Solicitud aprobada con éxito');
            } else {
                showRejectionToast('Solicitud rechazada exitosamente');
            }
            
            // Recargar la tabla después de la actualización exitosa
            await refetch();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    showErrorToast(`Error: ${error.response.data.message || `No se pudo ${estado === 'aprobado' ? 'aprobar' : 'rechazar'} la solicitud.`}`);
                } else if (error.request) {
                    showErrorToast('Error: No se recibió respuesta del servidor.');
                } else {
                    showErrorToast(`Error: ${error.message}`);
                }
            } else {
                showErrorToast('Error desconocido al procesar la solicitud');
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
                    Aprobar Accesos Pendientes
                </h2>
                <Toast autoClose={3000} theme="dark" className="custom-toast"/>
                <div className="w-full bg-white shadow-md rounded-lg p-4">
                    <table className="border-collapse w-full">
                        <thead className="block md:table-header-group">
                            <tr>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-red-600 border border-blue-700 hidden lg:table-cell" colSpan={8}>Aprobador: {aprobador}</th>
                            </tr>
                            <tr>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-gray-200 border border-blue-700 hidden lg:table-cell">ID</th>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-gray-200 border border-blue-700 hidden lg:table-cell">Solicitante</th>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-gray-200 border border-blue-700 hidden lg:table-cell">Fecha de Solicitud</th>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-gray-200 border border-blue-700 hidden lg:table-cell">Beneficiario</th>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-gray-200 border border-blue-700 hidden lg:table-cell">Dependencia</th>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-gray-200 border border-blue-700 hidden lg:table-cell">Motivo</th>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-gray-200 border border-blue-700 hidden lg:table-cell">Aprobar</th>
                                <th className="p-3 font-bold uppercase bg-blue-950 text-gray-200 border border-blue-700 hidden lg:table-cell">Rechazar</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {accesosPendientes.map((acceso) => (
                                <tr key={acceso._id} className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
                                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">ID</span>
                                        {acceso._id}
                                    </td>
                                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Solicitante</span>
                                        {acceso.userId.personId.name}
                                    </td>
                                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Fecha de Solicitud</span>
                                        {new Date(acceso.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Beneficiario</span>
                                        {acceso.beneficiario}
                                    </td>
                                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Dependencia</span>
                                        {acceso.centrocostoId.nombre}
                                    </td>
                                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Motivo</span>
                                        {acceso.motivo}
                                    </td>
                                    <td className="w-full lg:w-auto p-3 text-gray-800 border border-b block lg:table-cell relative lg:static">
                                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Aprobar</span>
                                        <div className="flex items-center justify-center">
                                            <button onClick={() => handleEstadoSolicitud(acceso._id, 'aprobado')} className="bg-green-500 hover:bg-green-700 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"><IonIcon icon={checkmarkCircle} className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                    <td className="w-full lg:w-auto p-3 text-gray-800 border border-b block lg:table-cell relative lg:static">
                                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Rechazar</span>
                                        <div className="flex items-center justify-center">
                                            <button onClick={() => handleEstadoSolicitud(acceso._id, 'rechazado')} className="bg-red-500 hover:bg-red-700 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"><IonIcon icon={trashOutline} className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AprobarAcceso