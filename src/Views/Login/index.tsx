import { Link } from 'react-router-dom'
import { logInOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
import { IsEmail, IsPassword} from '../../Library/Validations'
import { useState } from 'react'
import {TextBox} from '../../Components/Input'
import axios from 'axios'


import './Login.css'


export default function index() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    //Función para validar el formulario y enviar los datos al servidor
    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email')?.toString() || ''
        setEmailError(!IsEmail(email))
        const password = formData.get('password')?.toString() || ''
        setPasswordError(!IsPassword(password))
        try {
            alert(!emailError && !passwordError);
            if(!emailError && !passwordError){
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                    email,
                    password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 3000 // timeout de 5 segundos
                })
                alert(`${import.meta.env.VITE_API_URL}/login`)
                console.log(response.status)
                // Manejar login exitoso
            }
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Manejar errores específicos de la API
                console.error('Error de login:', error.response?.data)
            } else {
                // Manejar errores inesperados
                console.error('Error inesperado:', error)
            }
        }
    }
    return (
        <div className="bg-image w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 lg:mx-0 flex flex-col md:flex-row items-center rounded-lg z-10 overflow-hidden bg-center bg-cover bg-blue-600 shadow-xl shadow-blue-800/50">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white my-2 md:my-0">
                    HartDev
                </h1>
                <p className="mb-2 text-white hidden md:block font-mono">
                    search a new somethings
                </p>
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center bg-white py-5 md:py-8 px-4 justify-around">
                <h3 className="mb-4 font-bold text-3xl flex items-center text-blue-500">Inicio de Sesión</h3>
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
                <p className="text-gray-700 text-sm mt-2">No tienes una Cuenta?  <Link to="/registro" className="text-green-500 hover:text-green-600 mt-3 focus:outline-none font-bold underline">Registrate</Link></p>
            </div>
        </div>
    )
}