import { Link } from 'react-router-dom'
import { logInOutline } from 'ionicons/icons'
import { IsEmail, IsPassword} from '../../Library/Validations'
import { CustomError } from '../../Library/Errores';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ValidatedInput } from '../../Components/ValidatedInput'
import { SecureButton } from '../../Components/SecureButton'
import { SecureForm } from '../../Components/SecureForm'
import { showErrorToast, showSuccessToast } from '../../Components/Toast'
import axios from 'axios'

import './Login.css'

// Interfaz para la respuesta del login
interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name?: string;
        role?: string;
    };
}


export default function Index() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Función para manejar el envío del formulario
    const handleFormSubmit = async (formData: FormData): Promise<LoginResponse> => {
        const email = formData.get('email')?.toString() || '';
        const password = formData.get('password')?.toString() || '';

        // Validación final antes del envío
        if (!IsEmail(email)) {
            showErrorToast("Por favor, ingrese un email válido");
            throw new Error("Invalid email");
        }

        if (!IsPassword(password)) {
            showErrorToast("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial");
            throw new Error("Invalid password");
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            console.log(response.data.message);
            showSuccessToast("Inicio de sesión exitoso");

            // Manejar token JWT de forma segura
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }

            navigate('/');
            return response.data as LoginResponse;

        } catch (error) {
            if (error instanceof CustomError) {
                const errorData = error.toJSON();
                showErrorToast(`Error: ${errorData.message}`);
                throw error;
            } else if (error instanceof axios.AxiosError) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    // Este error activará el sistema de intentos fallidos
                    throw new Error("Credenciales incorrectas");
                } else if (error.response?.status === 404) {
                    // Redirigir a vista de error para credenciales inválidas
                    const errorData = error.response.data;
                    navigate('/error', {
                        state: {
                            code: 404,
                            message: errorData?.message || "Error en Inicio de Sesión",
                            detail: errorData?.details || "Las Credenciales del usuario no son válidas"
                        }
                    });
                    return { success: false, message: "Redirigiendo a página de error" };
                } else {
                    const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
                    showErrorToast(errorMessage);
                    throw error;
                }
            } else {
                showErrorToast('Ha ocurrido un error inesperado');
                throw error;
            }
        }
    };

    return (
        <div className="bg-image w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 lg:mx-0 flex flex-col md:flex-row items-center rounded-lg z-10 overflow-hidden bg-center bg-cover bg-blue-950 ">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-15 bg-blue-600 backdrop">
                <img src="/images/imperial.png" alt="Logo" className="h-16 w-16 md:h-12 md:w-12 rounded-full" />            
                <p className="mb-2 text-blue-950  hidden md:block font-mono">
                    Control de Acceso
                </p>
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center bg-white py-5 md:py-8 px-4 justify-around">
                <span className="text-2xl font-bold mb-4">
                    <img src="/images/imperial_letras.png" alt="Logo" className="h-7" />
                </span>
                
                <SecureForm
                    onSubmit={handleFormSubmit}
                    config={{
                        maxAttempts: 3,
                        blockDurationMinutes: 15,
                        storageKey: 'loginAttempts',
                        minDelayMs: 1000,
                        timeoutMs: 5000
                    }}
                    className='w-full'
                >
                    {({ isLoading, isBlocked }) => (
                        <>
                            <ValidatedInput
                                name="email"
                                type="email"
                                placeholder="email.."
                                label="Email"
                                value={email}
                                onChange={setEmail}
                                validator={IsEmail}
                                errorMessage="Por favor, ingrese un email válido"
                                autoLowercase={true}
                                realTimeValidation={true}
                                required={true}
                            />
                            
                            <ValidatedInput
                                name="password"
                                type="password"
                                placeholder="password.."
                                label="Password"
                                value={password}
                                onChange={setPassword}
                                validator={IsPassword}
                                errorMessage="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial"
                                realTimeValidation={true}
                                required={true}
                            />
                            
                            <SecureButton
                                isLoading={isLoading}
                                isBlocked={isBlocked}
                                loadingText="Verificando..."
                                blockedText="Cuenta Bloqueada"
                                normalText="LogIn"
                                icon={logInOutline}
                                type="submit"
                                variant="primary"
                            />
                        </>
                    )}
                </SecureForm>
                
                <p className="text-gray-700 text-sm mt-2">
                    No tienes una Cuenta?  
                    <Link to="/registro" className="text-red-600 hover:text-blue-950 mt-3 focus:outline-none font-bold underline ml-1">
                        Registrate
                    </Link>
                </p>
            </div>
        </div>
    )
}