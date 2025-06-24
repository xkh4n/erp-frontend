import { saveOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
import { useState } from 'react';
import { IsParagraph } from '../../../../Library/Validations';
import { CustomError, createValidationError } from '../../../../Library/Errores';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


type ErrorState = {
    code: number;
    message: string;
    detail: string;
};

export default function CrearProducto() {
    const navigate = useNavigate();

    const [productoName, setProducto] = useState('')
    const [productoModelo, setModelo] = useState('')
    const [productoDescripcion, setDescripcion] = useState('')

    function handleError(error: unknown, navigate: (path: string, options?: { state: ErrorState }) => void) {
        if (error instanceof CustomError) {
            const errorData = error.toJSON();
            navigate('/error', {
                state: {
                    code: errorData.code,
                    message: errorData.message,
                    detail: errorData.details
                }
            });
        } else if (error instanceof axios.AxiosError) {
            navigate('/error', {
                state: {
                    code: error.response?.status || 500,
                    message: error.message || 'Network Error',
                    detail: error.response?.statusText || 'Unknown error'
                }
            });
        }
    }

    const validateField = (fieldValue: string, fieldName: string) => {
        try {
            if (!IsParagraph(fieldValue) || fieldValue === '') {
                throw createValidationError(`Error al Validar ${fieldName}: `, fieldValue);
            }
        } catch (error) {
            handleError(error, navigate);
        }
    }

    const handlerSubmit = async () => {
        try {
            console.log("VITE_API_URL", import.meta.env.VITE_API_URL);
            validateField(productoName, 'el Nombre del Producto');
            validateField(productoModelo, 'el Modelo del Producto');
            validateField(productoDescripcion, 'la Descripción del Producto');
            
            const datosEnviar = [{
                nombre: productoName,
                modelo: productoModelo,
                descripcion: productoDescripcion
            }];
    
            
            await axios.put(`${import.meta.env.VITE_API_URL}/producto/nuevo`, datosEnviar, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 3000 // timeout de 3 segundos
            });
            setProducto('');
            setModelo('');
            setDescripcion('');
            alert('Producto creado exitosamente');
            // Redirigir a la página de productos después de guardar el producto
            navigate('/productos'); // Redirige a la página de productos después de guardar el producto
        } catch (error) {
            handleError(error, navigate);
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6'>
            <div className='w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8'>
                <h1 className='text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800'>Creación de Producto</h1>
                <form className='w-full'>
                    <div className='grid grid-cols-1 max-[1000px]:grid-cols-1 min-[1000px]:grid-cols-10 xl:grid-cols-12 gap-4 min-[1000px]:gap-6'>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-3 xl:col-span-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='producto'>Nombre del Producto</label>
                            <input 
                                id='producto'
                                name='producto'
                                type="text"
                                value={productoName}
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                onChange={e => setProducto(e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='modelo'>Modelo</label>
                            <input
                                id='modelo'
                                value={productoModelo}
                                name='modelo'
                                type="text"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                onChange={e => setModelo(e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-5 xl:col-span-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor='prodDescripcion'>Descripción del Producto</label>
                            <input
                                id='prodDescripcion'
                                name='prodDescripcion'
                                type="text"
                                value={productoDescripcion}
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                onChange={e => setDescripcion(e.target.value.toUpperCase())}
                            />
                        </div>
                    </div>
                    <div className='flex flex-1 row-auto'>
                    <button type='button' onClick={handlerSubmit} className="flex justify-center mt-5 items-center bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-white focus:outline-none focus:ring py-2 w-full rounded-full shadow-xl hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1">
                        <IonIcon icon={saveOutline} className="w-5 h-5" />
                        <p className="ml-1 text-lg">Guardar</p>
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
