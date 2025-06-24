import { TextBox } from "../../Components/Input";
import { useState } from 'react'
import { IsEmail, IsParagraph, IsPassword} from '../../Library/Validations'
import { useNavigate } from 'react-router-dom';
import { CustomError, createValidationError } from '../../Library/Errores';
import { personAddOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
import Popup from '../../Components/Popup';
import axios from 'axios'

export default function Index() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreError, setNombreError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [errorCode, setErrorCode] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorDetails, setErrorDetails] = useState('');

    const handlePopupClose = () => {
        setShowPopup(false);
        window.location.href = '/login';
    };

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const nombre = formData.get('name')?.toString() || ''
        const email = formData.get('email')?.toString() || ''
        const password = formData.get('password')?.toString() || ''
        try {
            if(name!= '' || email!= '' || password!= ''){
                if(!IsEmail(email)){
                    setEmailError(true)
                    return createValidationError('El email no es valido', email);
                }
                if(!IsPassword(password)){
                    setPasswordError(true)
                    return createValidationError('La contraseña no es valida', password);
                }
                if(!IsParagraph(nombre)){
                    setNombreError(true)
                    return createValidationError('El nombre no es valido', nombre); 
                }
                const response = await axios.put(`${import.meta.env.VITE_API_URL}/registro/basico`, [{
                    email,
                    password,
                    name
                }], {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 3000 // timeout de 3 segundos
                })
                if(response.status === 200){
                    setShowPopup(true);
                }
            }else{
                throw createValidationError('Los Campos son Obligatorios', 'Los campos no pueden estar vacios');
            }
            
        } catch (error: any) {
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
            else if(error instanceof axios.AxiosError){
                navigate('/error', {
                    state: {
                        code: error.response?.status || 500,
                        message: error.message || 'Network Error',
                        detail: error.response?.statusText || 'Unknown error'
                    }
                });
                console.log(error.response);
            }
            else if(error){
                navigate('/error', {
                    state: {
                      code: 501,
                      message: error.name,
                      detail: error.message
                    }
                });
            }
        }
    }
    return (
        <>
            <div className="h-auto mt-10 bg-gradient-to-br flex justify-center items-center w-full">
                <form onSubmit={handlerSubmit}>
                    <div className="bg-white px-4 py-8 rounded-xl w-screen shadow-md max-w-sm">
                        <div className="space-y-4">
                            <h1 className="text-center text-2xl font-semibold text-blue-950">Registro de Usuario</h1>
                            <div>
                                <TextBox
                                    label="Nombre"
                                    type="text"
                                    name="name"
                                    placeholder="Nombre"
                                    error={nombreError}
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
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
                        <button className="flex justify-center items-center mt-4 w-full bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-indigo-100 py-2 rounded-full text-lg tracking-wide hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1">
                            <IonIcon icon={personAddOutline} className="w-5 h-5" />
                            <p className="ml-4 text-lg">Registro</p>
                        </button>
                    </div>
                </form>
            </div>
            <Popup
                message="Registro exitoso"
                isOpen={showPopup}
                onClose={handlePopupClose}
                type="success"
            />
        </>
    )
}
