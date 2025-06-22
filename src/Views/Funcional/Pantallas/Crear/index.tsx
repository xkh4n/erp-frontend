import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { saveOutline, alertCircleOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
import { CustomError } from '../../../../Library/Errores';
import { useNavigate } from 'react-router-dom';
import Checked from "../../../../Components/Checked";




type ErrorState = {
        code: number;
        message: string;
        detail: string;
};

type Respuesta = {
    _id: string;
    nombre: string;
    codigo?:number;
};


export default function CrearPantalla() {
    const navigate = useNavigate();

    

    const [gerencias, setGerencias] = useState<Respuesta[]>([]);
    const [subgerencias, setSubgerencias] = useState<Respuesta[]>([]);
    const [departamentos, setDepartamentos] = useState<Respuesta[]>([]);
    const [servicios, setServicios] = useState<Respuesta[]>([]);
    const [procesos, setProcesos] = useState<Respuesta[]>([]);
    const [pantalla, setPantalla] = useState<string>('');



    const [selectedGerencia, setSelectedGerencia] = useState('');
    const [selectedSubgerencia, setSelectedSubgerencia] = useState('');
    const [selectedDepartamento, setSelectedDepartamento] = useState('');
    const [selectedServicio, setSelectedServicio] = useState('');
    const [selectedProceso, setSelectedProceso] = useState('');

    const [subgerenciaChecked, setSubgerenciaChecked] = useState(false);
    const [departamentoChecked, setDepartamentoChecked] = useState(false);
    const [servicioChecked, setServicioChecked] = useState(false);


    // Centraliza el manejo de errores
    const handleError = useCallback((error: unknown, navigate: (path: string, options?: { state: ErrorState }) => void) => {
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
    }, [navigate]);

    // Funciones de fetch para cargar los select
    const fetchGerencias = useCallback(async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/gerencia/todas`, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 3000
            });
            setGerencias(response.data.data);
        } catch (error) {
            handleError(error, navigate);
        }
    }, [handleError, navigate]);

    const fetchSubgerencias = useCallback(async (gerenciaId: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/subgerencia/poridgerencia`, {
                gerencia: gerenciaId
            }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 3000
            });
            setSubgerencias(response.data.data);
        } catch (error) {
            handleError(error, navigate);
        }
    }, [handleError, navigate]);

    const fetchDepartamentos = useCallback(async (subgerenciaId?: string) => {
        try {
            if (subgerenciaChecked && subgerenciaId) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/depto/getbyidsubgerencia`, {
                    id: subgerenciaId
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 3000
                });
                setDepartamentos(response.data.data);
            } else if (!subgerenciaChecked && departamentoChecked) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/depto/todos`, {}, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 3000
                });
                setDepartamentos(response.data.data);
            } else {
                setDepartamentos([]);
            }
        } catch (error) {
            handleError(error, navigate);
        }
    }, [subgerenciaChecked, departamentoChecked, handleError, navigate]);

    const fetchServicios = useCallback(async () => {
        try {
            if (servicioChecked && !departamentoChecked) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/servicios/todos`, {}, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 3000
                });
                setServicios(response.data.data);
            } else if (servicioChecked && departamentoChecked && selectedDepartamento) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/servicios/getbydeptocodigo`, {
                    departamento: parseInt(selectedDepartamento)
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 3000
                });
                setServicios(response.data.data);
            } else {
                setServicios([]);
            }
        } catch (error) {
            handleError(error, navigate);
        }
    }, [servicioChecked, departamentoChecked, selectedDepartamento, handleError, navigate]);

    // useEffect para cargar gerencias al inicio
    useEffect(() => {
        fetchGerencias();
    }, [fetchGerencias]);

    // useEffect para cargar subgerencias cuando cambia la gerencia
    useEffect(() => {
        setSelectedSubgerencia("");
        setSubgerencias([]);
        if (selectedGerencia) fetchSubgerencias(selectedGerencia);
    }, [selectedGerencia, fetchSubgerencias]);

    // useEffect para cargar departamentos según lógica optimizada
    useEffect(() => {
        setSelectedDepartamento("");
        setDepartamentos([]);
        fetchDepartamentos(selectedSubgerencia);
    }, [subgerenciaChecked, departamentoChecked, selectedSubgerencia, fetchDepartamentos]);

    // useEffect para cargar servicios según lógica optimizada
    useEffect(() => {
        setSelectedServicio("");
        setServicios([]);
        fetchServicios();
    }, [servicioChecked, departamentoChecked, subgerenciaChecked, selectedDepartamento, fetchServicios]);

    // Limpia procesos y pantalla cuando cambia el servicio
    useEffect(() => {
        setSelectedProceso("");
        setProcesos([]);
        // Aquí puedes agregar fetchProcesos si lo necesitas
    }, [selectedServicio]);


    const checkValidation = async () => {
        try {
            if(subgerenciaChecked === true && departamentoChecked === true && servicioChecked === true){
                // No se hace nada, ya que todos los campos están seleccionados
                alert("Todos los campos están seleccionados, no se requiere validación adicional.");
            }
            if(subgerenciaChecked === false && departamentoChecked === true && servicioChecked === true){
                // No se hace nada, ya que todos los campos están seleccionados
                alert("Departamento y Servicio Seleccionado, SubGerencia NO.");
            }
            if(subgerenciaChecked === false && departamentoChecked === false && servicioChecked === true){
                // No se hace nada, ya que todos los campos están seleccionados
                setSelectedGerencia(selectedGerencia);
                setSelectedSubgerencia(""); // Si no se selecciona subgerencia, se toma la gerencia
                setSelectedDepartamento(""); // Si no se selecciona departamento, se toma la subgerencia
                setSelectedServicio(selectedServicio); // Si no se selecciona servicio, se toma el departamento
                setSelectedProceso(selectedProceso); // Si no se selecciona proceso, se toma el servicio
                setPantalla(pantalla); // Si no se selecciona pantalla, se toma la gerencia
                alert("Sólo Servicio Seleccionado.");
            }
            if(subgerenciaChecked === true && departamentoChecked === false && servicioChecked === true){
                // No se hace nada, ya que todos los campos están seleccionados
                alert("SubGerencia y Servicio Seleccionada, Departamento NO.");
            }
            if(subgerenciaChecked === true && departamentoChecked === false && servicioChecked === false){
                // No se hace nada, ya que todos los campos están seleccionados
                alert("SubGerencia Seleccionada, Departamento y Servicio NO.");
            }
            if(subgerenciaChecked === true && departamentoChecked === true && servicioChecked === false){
                // No se hace nada, ya que todos los campos están seleccionados
                alert("SubGerencia y Departamento Seleccionada, Servicio NO.");
            }
            if(subgerenciaChecked === false && departamentoChecked === true && servicioChecked === false){
                // No se hace nada, ya que todos los campos están seleccionados
                alert("Departamento Seleccionado, SubGerencia y Servicio NO.");
            }
            if(subgerenciaChecked === false && departamentoChecked === false && servicioChecked === false){
                // No se hace nada, ya que todos los campos están seleccionados
                alert("Ningún campo seleccionado.");
            }
        }catch (error) {
            handleError(error, navigate);
        }
    }
    // Función para manejar el envío del formulario
    const handlerSubmit = async () => {
        try {
            checkValidation();
            /*
            const datosEnviar = {
                "gerencia": selectedGerencia, //_id
                "subgerencia": selectedSubgerencia, //_id
                "departamento": selectedDepartamento, //codigo
                "servicio": selectedServicio, //codigo
                "proceso": selectedProceso, //_id
                "pantalla": pantalla
            };
            // Enviar datos al backend
            
            await axios.put(`${import.meta.env.VITE_API_URL}/vista/nueva`, datosEnviar, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            });
            */
            // Limpiar los campos del formulario
            setGerencias([]);
            setSelectedGerencia('');
            setSubgerencias([]);
            setSelectedSubgerencia('');
            setDepartamentos([]);
            setSelectedDepartamento('');
            setServicios([]);
            setSelectedServicio('');
            setProcesos([]);
            setSelectedProceso('');
            setPantalla('');
            fetchGerencias();
            setSubgerenciaChecked(false);
            setDepartamentoChecked(false);
            setServicioChecked(false);
            // Manejar la respuesta del backend
            toast.success("¡Solicitud Creada exitosamente!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            // Redireccionar al usuario a la página de lista de pantallas
            navigate("/crearpantalla");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error("Error desconocido al procesar la solicitud", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            
        }
    }
    return (
        <div className='flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6'>
            <ToastContainer aria-label="Notificaciones de la aplicación" />
            <div className='w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8'>
                <h1 className='text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800'>Creación de Pantalla</h1>
                <form className='w-full'>
                    <div className='grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-6 min-[1000px]:grid-cols-9 min-[1200px]:grid-cols-12 min-[1400px]:grid-cols-12 gap-4'>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
                            <div className="flex content-around ">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='gerencia'>Gerencia</label>
                            </div>
                            <select id='gerencia' name='gerencia' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedGerencia(e.target.value)}>
                                <option value="">Seleccione una Gerencia</option>
                                {gerencias.map(gerencia => (
                                    <option key={gerencia._id} value={gerencia._id}>{gerencia.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
                            <div className="flex content-around ">
                                <Checked id='subgerenciachk' name='subgerenciachk' checked={subgerenciaChecked} onChange={e => setSubgerenciaChecked(e.target.checked)} />
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='subgerencia'>Subgerencia</label>
                                <IonIcon icon={alertCircleOutline} className="text-red-500 ml-2" title="Si no se selecciona una subgerencia, se tomará como subgerencia la gerencia seleccionada." />
                            </div>
                            <select id='subgerencia' name='subgerencia' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedSubgerencia(e.target.value)} disabled={!subgerenciaChecked}>
                                <option value="">Seleccione una Subgerencia</option>
                                <option value="nuevasubgerencia">Nueva SubGerencia</option>
                                {subgerencias.map(subgerencia => (
                                    <option key={subgerencia._id} value={subgerencia._id}>{subgerencia.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
                            <div className="flex content-around ">
                                <Checked id='departamentochk' name='departamentochk' checked={departamentoChecked} onChange={e => setDepartamentoChecked(e.target.checked)} />
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='departamento'>Departamento</label>
                                <IonIcon icon={alertCircleOutline} className="text-red-500 ml-2" title="Si no se selecciona un departamento, se tomará como departamento la subgerencia seleccionada." />
                            </div>
                            <select id='departamento' name='departamento' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedDepartamento(e.target.value)} disabled={!(departamentoChecked || subgerenciaChecked)}>
                                <option value="">Seleccione un Departamento</option>
                                <option value="nuevodepartamento">Nuevo Departamento</option>
                                {departamentos.map(departamento => (
                                    <option key={departamento._id} value={departamento.codigo}>{departamento.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
                            <div className="flex content-around ">
                                <Checked id='serviciochk' name='serviciochk' checked={servicioChecked} onChange={e => setServicioChecked(e.target.checked)} />
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='servicio'>Servicio</label>
                                <IonIcon icon={alertCircleOutline} className="text-red-500 ml-2" title="Si no se selecciona un servicio, se tomará como servicio el departamento seleccionado." />
                            </div>
                            <select id='servicio' name='servicio' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedServicio(e.target.value)} disabled={!servicioChecked}>
                                <option value="">Seleccione un Servicio</option>
                                <option value="nuevoservicio">Nuevo Servicio</option>
                                {servicios.map(servicio => (
                                    <option key={servicio._id} value={servicio.codigo}>{servicio.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='proceso'>Proceso</label>
                            <select id='proceso' name='proceso' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedProceso(e.target.value)} disabled={!selectedServicio}>
                                <option value="">Seleccione un Proceso</option>
                                <option key="newprocess" value="newprocess">Nuevo Proceso</option>
                                {procesos.map(proceso => (
                                    <option key={proceso._id} value={proceso._id}>{proceso.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='pantalla'>Nombre de Pantalla</label>
                            <input value={pantalla} id='pantalla' name='pantalla' type="text" className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={(e) => setPantalla(e.target.value.toUpperCase())}  />
                        </div>
                    </div>
                    <div className="flex flex-1 row-auto justify-center">
                        <button
                            type="button"
                            onClick={handlerSubmit}
                            className="flex justify-center mt-5 items-center bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-white focus:outline-none focus:ring py-2 w-60 rounded-full shadow-xl hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                        >
                            <IonIcon icon={saveOutline} className="w-5 h-5" />
                            <p className="ml-1 text-lg">Guardar</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
