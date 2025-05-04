import React, { useState, useEffect } from 'react';
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
            console.log("Gerencias: ",response.data.data)
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
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
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
            console.log("SubGerencias: ",response.data.data)
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
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
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
            console.log("Departamentos: ",response.data.data)
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
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
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
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/servicio/getbydepartamento`,{
                "departamento": parseInt(selectedDepartamento)
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            })
            console.log(response.data.data)
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
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
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
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/proceso/getbyservicio`,{
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
                navigate('/error', {
                    state: {
                        code: errorData.code,
                        message: errorData.message,
                        detail: errorData.details
                    }
                });
                setErrorCode(errorData.code);
                setErrorMessage(errorData.message);
                setErrorDetails(errorData.details);
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
        <div className=' bg-gray-200 flex-1 w-screen ml-2 mr-2'>
            <h1>Asignar Pantalla</h1>
            <select onChange={e => setSelectedGerencia(e.target.value)}>
                <option value="">Seleccione una Gerencia</option>
                {gerencias.map(gerencia => (
                    <option key={gerencia._id} value={gerencia._id}>{gerencia.nombre}</option>
                ))}
            </select>

            <select onChange={e => setSelectedSubgerencia(e.target.value)} disabled={!selectedGerencia}>
                <option value="">Seleccione una Subgerencia</option>
                {subgerencias.map(subgerencia => (
                    <option key={subgerencia._id} value={subgerencia._id}>{subgerencia.nombre}</option>
                ))}
            </select>

            <select onChange={e => setSelectedDepartamento(e.target.value)} disabled={!selectedSubgerencia}>
                <option value="">Seleccione un Departamento</option>
                {departamentos.map(departamento => (
                    <option key={departamento._id} value={departamento.codigo}>{departamento.nombre}</option>
                ))}
            </select>

            <select onChange={e => setSelectedServicio(e.target.value)} disabled={!selectedDepartamento}>
                <option value="">Seleccione un Servicio</option>
                {servicios.map(servicio => (
                    <option key={servicio._id} value={servicio.codigo}>{servicio.nombre}</option>
                ))}
            </select>

            <select disabled={!selectedServicio}>
                <option value="">Seleccione un Proceso</option>
                {procesos.map(proceso => (
                    <option key={proceso._id} value={proceso._id}>{proceso.nombre}</option>
                ))}
            </select>
        </div>
    );
}
