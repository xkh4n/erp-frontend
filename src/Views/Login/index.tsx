import { Link } from 'react-router-dom'
import { logInOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
import './Login.css'
export default function index() {
    const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        alert('login')
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
                <form className='' onSubmit={handlerSubmit}>
                    <input 
                        type="email" placeholder="email.."
                        className=" mb-3 px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500"
                    />
                    <input 
                        type="password" placeholder="password.."
                        className="mb-3 px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500"
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