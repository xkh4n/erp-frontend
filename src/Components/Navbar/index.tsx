import { Link } from "react-router-dom";
export default function index() {
    return (
        <nav className="bg-gray-200 shadow shadow-gray-300 w-100 px-8 md:px-auto">
            <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
                <div className="text-blue-950 md:order-1 flex items-center gap-2">
                    <img src="/images/imperial.png" alt="Logo" className="h-16 w-16 md:h-12 md:w-12 rounded-full" />
                    <span className="text-2xl font-bold">
                        <img src="/images/imperial_letras.png" alt="Logo" className="h-5" />
                    </span>
                </div>
                <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
                    <ul className="flex font-semibold justify-between">
                        <li className="md:px-4 md:py-2 text-red-600"><Link to="/">Home</Link></li>
                        <li className="md:px-4 md:py-2 text-blue-900 hover:text-red-600"><Link to="/contacto">Contacto</Link></li>
                        <li className="md:px-4 md:py-2 text-blue-900 hover:text-red-600"><Link to="/registro">Registro</Link></li>
                    </ul>
                </div>
                <div className="order-2 md:order-3">
                    <Link to="/login">
                        <button className="px-4 py-2 bg-blue-950 hover:bg-red-600 text-gray-50 rounded-xl flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Login</span>
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
