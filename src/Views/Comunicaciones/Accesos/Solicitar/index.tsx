import { checkmarkOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useState, useCallback, useEffect } from "react";
import { useCentrosCosto, useAuth, useDependenciasDefault } from "../../../../Library/Hooks";
import NewDatePicker from '../../../../Components/NewDatePicker';

import { 
    Toast,
    showApprovalToast,
    showErrorToast
} from "../../../../Components/Security";
import axios from "axios";



function SolicitarAcceso() {
    const [solicitante, setSolicitante] = useState("");
    const [beneficiario, setBeneficiario] = useState("");
    const [fechaIngreso, setFechaIngreso] = useState<Date | null>(new Date());
    const [motivo, setMotivo] = useState("");
    
    const { user, accessToken, isAuthenticated } = useAuth();
    const { centrosCostos } = useCentrosCosto();
    const { dependencias } = useDependenciasDefault();
    const [selectedCentroCosto, setSelectedCentroCosto] = useState("");

    const [selectedDependencia, setSelectedDependencia] = useState("");

    // Establecer automáticamente el nombre del usuario al cargar el componente
    useEffect(() => {
        if (user && (user.nombre || user.name || user.username)) {
            setSolicitante(user.nombre || user.name || user.username);
        }
    }, [isAuthenticated, accessToken, user]);

        // Función para limpiar el formulario después del envío exitoso
    
    const resetForm = () => {
        setSolicitante("");
        setBeneficiario("");
        setSelectedCentroCosto("");
        setSelectedDependencia("");
        setMotivo("");
        setFechaIngreso(new Date());
    };

    const handlerSolicitarAcceso = useCallback(async () => {
        // Obtener valores del formulario y useState como respaldo
        const formData = {
            solicitante: (document.getElementById('solicitante') as HTMLInputElement)?.value || solicitante,
            beneficiario: (document.getElementById('beneficiario') as HTMLInputElement)?.value || beneficiario,
            centroCosto: (document.getElementById('centro-costo') as HTMLSelectElement)?.value || selectedCentroCosto,
            dependencia: (document.getElementById('acceso-para') as HTMLSelectElement)?.value || selectedDependencia,
            motivo: (document.getElementById('motivo') as HTMLInputElement)?.value || motivo,
            fechaIngreso: fechaIngreso
        };

        // Función de validación de campos
        const validaFields = () => {
            if (!formData.solicitante.trim() || !formData.beneficiario.trim() || !formData.fechaIngreso || !formData.motivo.trim() || !formData.centroCosto || !formData.dependencia) {
                showErrorToast('Por favor, complete todos los campos obligatorios.');
                return false;
            }
            return true;
        };

        // Primero validar todos los campos
        const validacion = validaFields();
        if (!validacion) return;

        // Validación adicional de fecha
        if (!formData.fechaIngreso) {
            showErrorToast('Por favor, seleccione una fecha de ingreso válida.');
            return;
        }
        const datosEnviar = {
            "solicitante": formData.solicitante.trim(),
            "beneficiario": formData.beneficiario.trim(),
            "centroCosto": formData.centroCosto,
            "dependencia": formData.dependencia,
            "motivo": formData.motivo.trim(),
            "fechaIngreso": formData.fechaIngreso
        }
        await axios.put(`${import.meta.env.VITE_API_URL}/acceso/nuevo`, datosEnviar, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 3000 // timeout de 3 segundos
                }).then(() => {
            showApprovalToast('Solicitud enviada con éxito');
            resetForm();
        }).catch((error) => {
            if (error.response) {
                // La solicitud fue hecha y el servidor respondió con un código de estado
                showErrorToast(`Error: ${error.response.data.message || 'No se pudo enviar la solicitud.'}`);
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                showErrorToast('Error: No se recibió respuesta del servidor.');
            } else {
                // Algo pasó al configurar la solicitud que provocó un error
                showErrorToast(`Error: ${error.message}`);
            }
        });

    }, [isAuthenticated, accessToken, solicitante, beneficiario, selectedCentroCosto, selectedDependencia, motivo, fechaIngreso]);

    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
            <Toast autoClose={3000} theme="dark" className="custom-toast"/>
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
                    Solicitar Acceso a Sala de Comunicaciones
                </h2>
                <form className="w-full">
                    <div className="grid grid-cols-1 max-[799px]:grid-cols-1  min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
                        {/* Solicitante */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-3">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="solicitante"
                            >
                                Solicitante
                            </label>
                            <input
                                id="solicitante"
                                name="solicitante"
                                value={solicitante}
                                onChange={(e) => setSolicitante(e.target.value)}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el nombre del solicitante"
                            />
                        </div>
                        {/* Centro de Costo */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-3">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="centro-costo"
                            >
                                Centro de Costo
                            </label>
                            <select
                                id="centro-costo"
                                name="centro-costo"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedCentroCosto}
                                onChange={(e) => setSelectedCentroCosto(e.target.value)}
                            >
                                <option value="">Seleccione Centro de Costo</option>
                                {centrosCostos.map((costos) => (
                                    <option key={costos._id} value={costos._id}>
                                        {costos.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Beneficiario */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-3">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="beneficiario"
                            >
                                Beneficiario
                            </label>
                            <input
                                id="beneficiario"
                                name="beneficiario"
                                value={beneficiario}
                                onChange={(e) => setBeneficiario(e.target.value)}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el nombre del beneficiario"
                            />
                        </div>
                        {/* Acceso Para */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-3 min-[1200px]:col-span-3 min-[1400px]:col-span-3">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="acceso-para"
                            >
                                Acceso para
                            </label>
                            <select
                                id="acceso-para"
                                name="acceso-para"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedDependencia}
                                onChange={(e) => setSelectedDependencia(e.target.value)}
                            >
                                <option value="">Seleccione Dependencia</option>
                                {dependencias.map((dep) => (
                                    <option key={dep._id} value={dep.codigo}>
                                        {dep.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Datepicker */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="fechaIngreso"
                            >
                                Fecha de Ingreso
                            </label>
                            <NewDatePicker
                                id="fechaIngreso"
                                name="fechaIngreso"
                                selected={fechaIngreso}
                                onChange={setFechaIngreso}
                                required
                            />
                        </div>
                        {/* Motivo */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-5 min-[1400px]:col-span-10">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="motivo"
                            >
                                Motivo
                            </label>
                            <input
                                id="motivo"
                                name="motivo"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value.toUpperCase())}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el motivo"
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 row-auto justify-center gap-4">
                        <button
                            type="button"
                            onClick={handlerSolicitarAcceso}
                            className="flex justify-center mt-5 items-center bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring py-2 w-60 rounded-full shadow-xl hover:shadow-green-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                        >
                            <IonIcon icon={checkmarkOutline} className="w-5 h-5" />
                            <p className="ml-1 text-lg">Solicitar</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SolicitarAcceso