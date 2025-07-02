import { useState, useEffect } from 'react';
import axios from 'axios';
import { saveOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
import { CustomError, createValidationError } from '../../../../Library/Errores';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { IsParagraph } from '../../../../Library/Validations'
import "react-toastify/dist/ReactToastify.css";


type Respuesta = {
    _id: string;
    nombre: string;
    codigo?:number;
};



export default function CrearProceso() {
    const navigate = useNavigate();

    

    const [gerencias, setGerencias] = useState<Respuesta[]>([]);
    const [subgerencias, setSubgerencias] = useState<Respuesta[]>([]);
    const [departamentos, setDepartamentos] = useState<Respuesta[]>([]);
    const [servicios, setServicios] = useState<Respuesta[]>([]);

    const [description, setDescription] = useState("");
    const [nombre, setNombre] = useState("");
    const [lasProceso, setLastProceso] = useState("");


    const [selectedGerencia, setSelectedGerencia] = useState('');
    const [selectedSubgerencia, setSelectedSubgerencia] = useState('');
    const [selectedDepartamento, setSelectedDepartamento] = useState('');
    const [selectedServicio, setSelectedServicio] = useState('');



    const traeGerencias = async () => {
        if(!gerencias) return;
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/gerencia/todas`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            })
            setGerencias(response.data.data);
        }catch (error) {
            if(error instanceof CustomError){
                const errorData = error.toJSON();
                navigate('/error', {
                    state: {
                        code: errorData.code,
                        message: errorData.message,
                        detail: errorData.details
                    }
                });
            }
            if(error instanceof axios.AxiosError){
                navigate('/error', {
                    state: {
                        code: error.response?.status || 500,
                        message: error.message || 'Network Error',
                        detail: error.response?.statusText || 'Unknown error'
                    }
                });
                console.log(error.response);
            }
        }
    }

    const traeSubGerencias = async () => {
        if (!selectedGerencia) return;
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/subgerencia/poridgerencia`,{
                "gerencia":selectedGerencia
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            })
            setSubgerencias(response.data.data);
        }catch (error) {
            if(error instanceof CustomError){
                const errorData = error.toJSON();
                navigate('/error', {
                    state: {
                        code: errorData.code,
                        message: errorData.message,
                        detail: errorData.details
                    }
                });
            }
            if(error instanceof axios.AxiosError){
                navigate('/error', {
                    state: {
                        code: error.response?.status || 500,
                        message: error.message || 'Network Error',
                        detail: error.response?.statusText || 'Unknown error'
                    }
                });
                console.log(error.response);
            }
        }
    }

    const traeDepartamentos = async () => {
        if (!selectedSubgerencia) return;
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/depto/getbyidsubgerencia`,{
                "id":selectedSubgerencia
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            })
            setDepartamentos(response.data.data);
        }catch (error) {
            if(error instanceof CustomError){
                const errorData = error.toJSON();
                navigate('/error', {
                    state: {
                        code: errorData.code,
                        message: errorData.message,
                        detail: errorData.details
                    }
                });
            }
            if(error instanceof axios.AxiosError){
                navigate('/error', {
                    state: {
                        code: error.response?.status || 500,
                        message: error.message || 'Network Error',
                        detail: error.response?.statusText || 'Unknown error'
                    }
                });
                console.log(error.response);
            }
        }
    }

    const traerServicios = async () => {
        if (!selectedDepartamento) return;
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/servicios/getbydeptocodigo`,{
                "departamento": parseInt(selectedDepartamento)
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            })
            setServicios(response.data.data);
        }catch (error) {
            if(error instanceof CustomError){
                const errorData = error.toJSON();
                navigate('/error', {
                    state: {
                        code: errorData.code,
                        message: errorData.message,
                        detail: errorData.details
                    }
                });
            }
            if(error instanceof axios.AxiosError){
                navigate('/error', {
                    state: {
                        code: error.response?.status || 500,
                        message: error.message || 'Network Error',
                        detail: error.response?.statusText || 'Unknown error'
                    }
                });
                console.log(error.response);
            }
        }
    }


    useEffect(() => {
        // Fetch gerencias from backend
        traeGerencias();
    }, []);

    useEffect(() => {
        traeSubGerencias();
    }, [selectedGerencia]);

    useEffect(() => {
        traeDepartamentos();
    }, [selectedSubgerencia]);

    useEffect(() => {
        traerServicios();
    }, [selectedDepartamento]);

    const traeLastProcesos = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/procesos/getlastproceso`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            });
            setLastProceso(response.data.data.codigo);
            console.warn("Respuesta del servidor:", lasProceso);
        } catch (error) {
            if (error instanceof CustomError) {
                const errorData = error.toJSON();
                navigate('/error', {
                    state: {
                        code: errorData.code,
                        message: errorData.message,
                        detail: errorData.details
                    }
                });
            }
            if (error instanceof axios.AxiosError) {
                navigate('/error', {
                    state: {
                        code: error.response?.status || 500,
                        message: error.message || 'Network Error',
                        detail: error.response?.statusText || 'Unknown error'
                    }
                });
                console.log(error.response);
            }
        }
    }

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(selectedGerencia === '') throw createValidationError('La Gerencia no puede estar vacía', 'Debe Seleccionar una Gerencia');
            if(selectedSubgerencia === '') throw createValidationError('La Subgerencia no puede estar vacía', 'Debe Seleccionar una Subgerencia');
            if(selectedDepartamento === '') throw createValidationError('El Departamento no puede estar vacío', 'Debe Seleccionar un Departamento');
            if(selectedServicio === '') throw createValidationError('El Servicio no puede estar vacío', 'Debe Seleccionar un Servicio');
            if(!IsParagraph(nombre)) {
                throw createValidationError('El nombre del Proceso no es válido', 'Debe ingresar un nombre de Proceso válido');
            }
            await traeLastProcesos();
            
            // Extraer la parte numérica del último código y incrementar
            let nuevoCodigo = "PROC001"; // Código por defecto si no hay códigos anteriores
            if (lasProceso) {
                // Extraer los números del código (ej: "PROC030" -> "030")
                const numeroMatch = lasProceso.match(/(\d+)/);
                if (numeroMatch) {
                    const numeroActual = parseInt(numeroMatch[1]);
                    const numeroSiguiente = numeroActual + 1;
                    // Formatear con ceros a la izquierda para mantener 3 dígitos
                    const numeroFormateado = numeroSiguiente.toString().padStart(3, '0');
                    nuevoCodigo = `PROC${numeroFormateado}`;
                }
            }
            
            const datosEnviar = 
                [
                    {
                        codigo: nuevoCodigo,
                        gerencia: selectedGerencia,
                        subgerencia: selectedSubgerencia,
                        departamento: selectedDepartamento,
                        servicio: parseInt(selectedServicio),
                        nombre:nombre,
                        estado: true,
                        descripcion: description
                    }
                ];
            // Enviar datos al backend
            await axios.put(`${import.meta.env.VITE_API_URL}/procesos/nuevo`, datosEnviar, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            })
            toast.success("¡Solicitud Creada exitosamente!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            // Limpiar los campos del formulario
            setSelectedGerencia('');
            setSelectedSubgerencia('');
            setSelectedDepartamento('');
            setSelectedServicio('');
            setDescription('');
            setNombre('');
            // Traer nuevamente las gerencias, subgerencias, departamentos y servicios
            await traeGerencias();
            await traeSubGerencias();
            await traeDepartamentos();
            await traerServicios();
            // Redireccionar al usuario a la página de lista de pantallas
            navigate('/crearproceso');
        }catch (error) {
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
                <h1 className='text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800'>Creación de Proceso</h1>
                <form className='w-full' onSubmit={handlerSubmit}>
                    <div className='grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-6 min-[1000px]:grid-cols-9 min-[1200px]:grid-cols-12 min-[1400px]:grid-cols-12 gap-4'>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-3">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='gerencia'>Gerencia</label>
                            <select id='gerencia' name='gerencia' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedGerencia(e.target.value)}>
                                <option value="">Seleccione una Gerencia</option>
                                {gerencias.map(gerencia => (
                                    <option key={gerencia._id} value={gerencia._id}>{gerencia.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-3">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='subgerencia'>Subgerencia</label>
                            <select id='subgerencia' name='subgerencia' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedSubgerencia(e.target.value)} disabled={!selectedGerencia}>
                                <option value="">Seleccione una Subgerencia</option>
                                {subgerencias.map(subgerencia => (
                                    <option key={subgerencia._id} value={subgerencia._id}>{subgerencia.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-3">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='departamento'>Departamento</label>
                            <select id='departamento' name='departamento' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedDepartamento(e.target.value)} disabled={!selectedSubgerencia}>
                                <option value="">Seleccione un Departamento</option>
                                {departamentos.map(departamento => (
                                    <option key={departamento._id} value={departamento.codigo}>{departamento.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-4 min-[1200px]:col-span-3 min-[1400px]:col-span-3">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='servicio'>Servicio</label>
                            <select id='servicio' name='servicio' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedServicio(e.target.value)} disabled={!selectedDepartamento}>
                                <option value="">Seleccione un Servicio</option>
                                {servicios.map(servicio => (
                                    <option key={servicio._id} value={servicio.codigo}>{servicio.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-5 min-[1200px]:col-span-3 min-[1400px]:col-span-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='proceso'>Nombre del Proceso</label>
                            <input id='proceso' name='proceso' type="text" className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" value={nombre} onChange={e => setNombre(e.target.value.toUpperCase())} />
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-9 min-[1200px]:col-span-6 min-[1400px]:col-span-8">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='descripcion'>Descripción del Proceso</label>
                            <input id='descripcion' name='descripcion' type="text" className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" value={description} onChange={e => setDescription(e.target.value.toUpperCase())} />
                        </div>
                    </div>
                    <div className='flex flex-1 row-auto justify-center items-center mt-6'>
                        <button type='submit' className="flex justify-center mt-5 items-center bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-white focus:outline-none focus:ring py-2 w-80 rounded-full shadow-xl hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1">
                            <IonIcon icon={saveOutline} className="w-5 h-5" />
                            <p className="ml-1 text-lg">Guardar</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
