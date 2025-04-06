import { TextBox } from "../../Components/Input";
import { useState } from 'react'
import { IsEmail, IsPassword} from '../../Library/Validations'
import axios from 'axios'

export default function Index() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreError, setNombreError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const nombre = formData.get('nombre')?.toString() || ''
        setNombreError(!nombre)
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
            if (axios.isAxiosError(error)) {
                // Manejar errores específicos de la API
                console.error('Error de login:', error.response?.data?.message)
            } else {
                // Manejar errores inesperados
                console.error('Error inesperado:', error)
            }
        }
    }
    return (
        <div className="h-auto mt-10 bg-gradient-to-br flex justify-center items-center w-full">
            <form onSubmit={handlerSubmit}>
                <div className="bg-white px-4 py-8 rounded-xl w-screen shadow-md max-w-sm">
                    <div className="space-y-4">
                        <h1 className="text-center text-2xl font-semibold text-gray-600">Registro de Usuario</h1>
                        <div>
                            <TextBox
                                label="Nombre"
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                error={nombreError}
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value)
                                    setNombreError(false)
                                }}
                                errorMessage="Por favor, ingrese un nombre válido"
                            />
                        </div>
                        <div>
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
                        </div>
                        <div>
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
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide">Register</button>
                </div>
            </form>
        </div>
    )
}
