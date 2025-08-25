import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Library/Context/AuthContext";
import { 
    Toast, 
    showSuccessToast, 
    showErrorToast, 
    showInfoToast 
} from "../../../Components/Security";
import { IsRut, IsParagraph } from "../../../Library/Validations";

type CCosto = {
    _id: string;
    codigo: number;
    nombre: string;
}


const Asignar: React.FC = () => {
    const { accessToken, isAuthenticated } = useAuth();
    const [costos, setCostos] = useState<CCosto[]>([]);
    const [selectedCentroCosto, setSelectedCentroCosto] = useState<string>('');
    const [dni, setDni] = useState<string>('');
    const [serie, setSerie] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchCentrosCosto = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Verificar si el usuario está autenticado
                if (!isAuthenticated || !accessToken) {
                    setError('Usuario no autenticado. Por favor, inicie sesión.');
                    setLoading(false);
                    return;
                }
                
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/ccosto/getall`, {
                    page: 1,
                    limit: 9999, // Límite muy alto para obtener todos los registros
                    sortBy: 'nombre',
                    sortOrder: 'asc'
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });                
                if (response.data.codigo === 200 && response.data.data?.centros) {
                    // Ordenar alfabéticamente por nombre
                    const costosOrdenados = response.data.data.centros.sort((a: CCosto, b: CCosto) => 
                        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
                    );
                    setCostos(costosOrdenados);
                } else {
                    setError('No se pudieron cargar los centros de costo');
                    console.error('Error en respuesta:', response.data);
                }
            } catch (err: unknown) {
                console.error('Error al obtener centros de costo:', err);
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        setError('Token de autenticación inválido. Por favor, inicie sesión nuevamente.');
                    } else if (err.response?.status === 403) {
                        setError('No tiene permisos para acceder a esta información.');
                    } else {
                        setError(`Error al conectar con el servidor: ${err.message}`);
                    }
                } else {
                    setError('Error desconocido al conectar con el servidor');
                }
            } finally {
                setLoading(false);
            }
        };

        // Solo ejecutar si está autenticado
        if (isAuthenticated) {
            fetchCentrosCosto();
        } else {
            setLoading(false);
            setError('Usuario no autenticado');
        }
    }, [isAuthenticated, accessToken]);

    // Función para validar el formulario
    const validateForm = (): boolean => {
        if (!selectedCentroCosto) {
            showErrorToast("Por favor seleccione un centro de costo");
            return false;
        }

        if (!dni.trim()) {
            showErrorToast("Por favor ingrese el DNI/RUT del beneficiario");
            return false;
        }

        if (!IsRut(dni.trim())) {
            showErrorToast("El DNI/RUT ingresado no es válido");
            return false;
        }

        if (!serie.trim()) {
            showErrorToast("Por favor ingrese el número de serie del equipo");
            return false;
        }

        if (!IsParagraph(serie.trim())) {
            showErrorToast("El número de serie debe tener entre 3 y 50 caracteres válidos");
            return false;
        }

        return true;
    };

    // Función para enviar la asignación
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            if (!isAuthenticated || !accessToken) {
                showErrorToast("Usuario no autenticado. Por favor, inicie sesión.");
                return;
            }

            // Obtener el código del centro de costo seleccionado
            const centroCostoSeleccionado = costos.find(c => c._id === selectedCentroCosto);
            
            if (!centroCostoSeleccionado) {
                showErrorToast("Error al obtener el código del centro de costo");
                return;
            }

            const datosAsignacion = {
                dni: dni.trim(),
                serie: serie.trim(),
                centrocosto: centroCostoSeleccionado.codigo
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/asignacion/asignar`,
                datosAsignacion,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                showSuccessToast("Asignación creada exitosamente");

                // Limpiar el formulario
                setSelectedCentroCosto('');
                setDni('');
                setSerie('');

                // Opcional: navegar a otra página después de un tiempo
                setTimeout(() => {
                    // navigate('/asignaciones'); // Si existe una página de listado
                }, 2000);
            }
        } catch (error) {
            console.error('Error al crear asignación:', error);
            
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.response?.data?.mensaje || error.message;
                showErrorToast(`Error al crear la asignación: ${errorMessage}`);
            } else {
                showErrorToast("Error inesperado al crear la asignación");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Función para cancelar y limpiar el formulario
    const handleCancel = () => {
        setSelectedCentroCosto('');
        setDni('');
        setSerie('');
        
        showInfoToast("Formulario limpiado");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
                <div className="text-center">
                    <p>Cargando centros de costo...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
                <div className="text-center text-red-600">
                    <p>Error: {error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
            <Toast />
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Asignación de Activos
                </h2>
                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 max-[799px]:grid-cols-1  min-[1000px]:grid-cols-6 min-[1200px]:grid-cols-8 min-[1400px]:grid-cols-12 gap-4">
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-3 min-[1400px]:col-span-4">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="centro_costo"
                            >
                                Centro de Costo *
                            </label>
                            <select
                                id="centro_costo"
                                name="centro_costo"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                value={selectedCentroCosto}
                                onChange={(e) => setSelectedCentroCosto(e.target.value)}
                            >
                                <option value="">Seleccione su Centro de Costo</option>
                                {costos.map((centroCosto) => (
                                    <option key={centroCosto._id} value={centroCosto._id}>
                                        {centroCosto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="dni"
                            >
                                DNI/RUT *
                            </label>
                            <input
                                id="dni"
                                name="dni"
                                type="text"
                                value={dni}
                                onChange={(e) => setDni(e.target.value.toUpperCase())}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ej: 12345678-9"
                            />
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-3 min-[1400px]:col-span-4">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="serie"
                            >
                                Número de Serie *
                            </label>
                            <input
                                id="serie"
                                name="serie"
                                type="text"
                                value={serie}
                                onChange={(e) => setSerie(e.target.value.toUpperCase())}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ingrese el número de serie del equipo"
                            />
                        </div>
                    </div>
                    
                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={submitting}
                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium rounded-md transition duration-200 order-2 sm:order-1"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition duration-200 order-1 sm:order-2 flex items-center justify-center"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                'Guardar Asignación'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Asignar;