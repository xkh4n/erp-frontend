import React from 'react';
import { useNavigate } from 'react-router-dom';

// Interfaz para las propiedades del error
interface ErrorProps {
    code: number;
    message: string;
    detail?: string;
}

const ErrorPage: React.FC<ErrorProps> = ({ code, message, detail }) => {
    const navigate = useNavigate();
    // Mapeo de códigos de error a imágenes
    const errorImages: { [key: number]: string } = {
        400: '/errors/400.png',
        403: '/errors/403.png',
        404: '/errors/404.png',
        409: '/errors/409.png',
        500: '/errors/500.png',
        501: '/errors/501.png',
        // Agregar más códigos de error según sea necesario
    };

    // Obtener la imagen correspondiente al código de error
    const imageSrc = errorImages[code] || '/errors/404.png'; // Imagen predeterminada si no se encuentra

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        // Fallback si no existe la imagen
        (e.target as HTMLImageElement).src = '/errors/404.png';
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <img 
                src={imageSrc} 
                alt={`Error ${code}`} 
                className="h-1/3 opacity-90 shadow-lg shadow-red-600/95 rounded-full object-contain"
                onError={handleImageError}
            />
            <div className="flex flex-col items-center justify-center">
                <p className="mt-8 text-2xl md:text-3xl lg:text-4xl font-bold text-red-600">{message}</p>
                <p className="md:text-lg xl:text-xl text-amber-400 mt-4">{detail}</p>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 mt-4 bg-white text-blue-950 rounded-full hover:bg-red-600 shadow-red-600/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                >
                    Volver atrás
                </button>
            </div>
        </div>
  );
};

export default ErrorPage;