import { useState, useEffect } from 'react';
import axios from 'axios';
import { CustomError } from '../../../../Library/Errores';
import { useNavigate } from 'react-router-dom';


type Respuesta = {
    _id: string;
    nombre: string;
    codigo?:number;
};



export default function AsignarPantalla() {
    const navigate = useNavigate();

    

    const [gerencias, setGerencias] = useState<Respuesta[]>([]);
    const [subgerencias, setSubgerencias] = useState<Respuesta[]>([]);
    const [departamentos, setDepartamentos] = useState<Respuesta[]>([]);
    const [servicios, setServicios] = useState<Respuesta[]>([]);
    const [procesos, setProcesos] = useState<Respuesta[]>([]);

    const [selectedGerencia, setSelectedGerencia] = useState('');
    const [selectedSubgerencia, setSelectedSubgerencia] = useState('');
    const [selectedDepartamento, setSelectedDepartamento] = useState('');
    const [selectedServicio, setSelectedServicio] = useState('');

    const [errorCode, setErrorCode] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorDetails, setErrorDetails] = useState('');

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
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
                navigate('/error', {
                    state: {
                        code: errorCode,
                        message: errorMessage,
                        detail: errorDetails
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
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
                navigate('/error', {
                    state: {
                        code: errorCode,
                        message: errorMessage,
                        detail: errorDetails
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
            console.log("Traer Departamentos por Subgerencia");
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/depto/getbyidsubgerencia`,{
                "id":selectedSubgerencia
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            })
            if(response.data.data.length === 0){
                setDepartamentos([]);
                return;
            }
            setDepartamentos(response.data.data);
        }catch (error) {
            if(error instanceof CustomError){
                const errorData = error.toJSON();
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
                navigate('/error', {
                    state: {
                        code: errorCode,
                        message: errorMessage,
                        detail: errorDetails
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
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
                navigate('/error', {
                    state: {
                        code: errorCode,
                        message: errorMessage,
                        detail: errorDetails
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

    const traerProcesos = async () => {
        if (!selectedServicio) return;
        try {
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/procesos/getbyservicio`,{
                "servicio": parseInt(selectedServicio)
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            })
            console.log(response.data.data)
            setProcesos(response.data.data);
        }catch (error) {
            if(error instanceof CustomError){
                const errorData = error.toJSON();
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
                navigate('/error', {
                    state: {
                        code: errorCode,
                        message: errorMessage,
                        detail: errorDetails
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

    useEffect(() => {
        traerProcesos();
    }, [selectedServicio]);

    return (
        <div className='flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6'>
            <div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <h1 className='text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800'>Asignar Pantalla</h1>
                <form className='w-full'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='gerencia'>Gerencia</label>
                            <select id='gerencia' name='gerencia' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedGerencia(e.target.value)}>
                                <option value="">Seleccione una Gerencia</option>
                                {gerencias.map(gerencia => (
                                    <option key={gerencia._id} value={gerencia._id}>{gerencia.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='subgerencia'>Subgerencia</label>
                            <select id='subgerencia' name='subgerencia' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedSubgerencia(e.target.value)} disabled={!selectedGerencia}>
                                <option value="">Seleccione una Subgerencia</option>
                                {subgerencias.map(subgerencia => (
                                    <option key={subgerencia._id} value={subgerencia._id}>{subgerencia.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='departamento'>Departamento</label>
                            <select id='departamento' name='departamento' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedDepartamento(e.target.value)} disabled={!selectedSubgerencia}>
                                <option value="">Seleccione un Departamento</option>
                                {departamentos.map(departamento => (
                                    <option key={departamento._id} value={departamento.codigo}>{departamento.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='servicio'>Servicio</label>
                            <select id='servicio' name='servicio' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={e => setSelectedServicio(e.target.value)} disabled={!selectedDepartamento}>
                                <option value="">Seleccione un Servicio</option>
                                {servicios.map(servicio => (
                                    <option key={servicio._id} value={servicio.codigo}>{servicio.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='proceso'>Proceso</label>
                            <select id='proceso' name='proceso' className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" disabled={!selectedServicio}>
                                <option value="">Seleccione un Proceso</option>
                                {procesos.map(proceso => (
                                    <option key={proceso._id} value={proceso._id}>{proceso.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='pantalla'>Nombre de Pantalla</label>
                            <input id='pantalla' name='pantalla' type="text" className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" disabled={!selectedServicio} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
