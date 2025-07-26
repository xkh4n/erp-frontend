import { Link } from 'react-router-dom'
import { logInOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
import { IsEmail, IsPassword} from '../../Library/Validations'
import { CustomError } from '../../Library/Errores';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {TextBox} from '../../Components/Input'
import axios from 'axios'


import './Login.css'


export default function Index() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const [errorCode, setErrorCode] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorDetails, setErrorDetails] = useState('');
    //Función para validar el formulario y enviar los datos al servidor
    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email')?.toString() || ''
        setEmailError(!IsEmail(email))
        const password = formData.get('password')?.toString() || ''
        setPasswordError(!IsPassword(password))
        try {
            if(!emailError && !passwordError){
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                    email,
                    password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 3000 // timeout de 3 segundos
                })
                console.log(response.data.message)
                // Manejar login exitoso
            }
            
        } catch (error) {
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
                });;
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
                <form className='w-full' onSubmit={handlerSubmit}>
                    <TextBox
                        name="email"
                        type="email"
                        placeholder="email.."
                        label="Email"
                        value={email}
                        error={emailError}
                        errorMessage="Por favor, ingrese un email válido"
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setEmailError(false)
                        }}
                    />
                    <TextBox
                        name="password"
                        type="password"
                        placeholder="password.."
                        label="Password"
                        value={password}
                        error={passwordError}
                        errorMessage="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial"
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setPasswordError(false)
                        }}
                    />
                    <button type='submit' className="flex justify-center items-center bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-white focus:outline-none focus:ring py-2 w-full rounded-full shadow-xl hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1">
                        <IonIcon icon={logInOutline} className="w-5 h-5" />
                        <p className="ml-1 text-lg">LogIn</p>
                    </button>
                </form>
                <p className="text-gray-700 text-sm mt-2">No tienes una Cuenta?  <Link to="/registro" className="text-red-600 hover:text-blue-950 mt-3 focus:outline-none font-bold underline">Registrate</Link></p>
            </div>
        </div>
    )
}