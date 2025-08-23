import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBackOutline, homeOutline } from 'ionicons/icons';

// Interfaz para las propiedades del error
interface ErrorProps {
    code: number;
    message: string;
    detail?: string;
}

const ErrorPage: React.FC<ErrorProps> = ({ code, message, detail }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
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

    const handleGoBack = () => {
        // Verificar si hay un estado con la ruta anterior
        const referrer = location.state?.from;
        
        if (referrer) {
            // Si tenemos la ruta anterior, volver ahí
            navigate(referrer);
        } else if (window.history.length > 1) {
            // Si hay historial, usar navigate(-1)
            navigate(-1);
        } else {
            // Fallback: ir al dashboard/home
            navigate('/');
        }
    };

    const handleGoHome = () => {
        // Ir directamente al dashboard/home
        navigate('/');
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
                <div className="flex gap-4 mt-6">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 shadow-gray-600/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                    >
                        <IonIcon icon={arrowBackOutline} className="w-5 h-5" />
                        Volver atrás
                    </button>
                    <button
                        type="button"
                        onClick={handleGoHome}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-blue-600/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                    >
                        <IonIcon icon={homeOutline} className="w-5 h-5" />
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
  );
};

export default ErrorPage;