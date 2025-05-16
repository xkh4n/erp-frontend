import { Link } from "react-router-dom";
import { chevronDownOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import './index.css';

type MenuItem = {
    label: string;
    link: string;
    menuItems?: MenuItem[];
};

export default function index() {
    
    const menuItems: MenuItem[] = [
        { label: 'Home', link: '/' },
        { label: 'Contacto', link: '/contacto'},
        { label: 'Registro', link: '/registro'},
        { label: 'Sistemas', link: '#', menuItems: [
            { label: 'Desarrollo', link: '#' },
            { label: 'Presupuesto', link: '#' },
            { label: 'Produccion', link: '#', menuItems:[
                { label: 'Centralizado', link: '/centralizado', menuItems: [
                    { label: 'Solicitudes', link: '/solicitudes', menuItems: [
                        { label: 'Crear Solicitud', link: '/crearsolicitud' },
                        { label: 'Revisar Solicitud', link: '/revisarsolicitud' },
                        { label: 'Finalizar Solicitud', link: '/finalizarsolicitud' },
                    ] },
                    { label: 'Cuentas NT', link: '/cuentasnt', menuItems: [
                        { label: 'Crear Cuenta', link: '/crearcuentasnt'},
                        { label: 'Desbloquear Cuenta', link: '/desbloquearcuentasnt' },
                        { label: 'Suspender Cuenta', link: '/suspendercuentasnt'},
                    ] },
                    { label: 'Cuentas Correo', link: '/cuentascorreo', menuItems: [
                        { label: 'Crear Cuenta', link: '/crearcuentascorreo' },
                        { label: 'Desbloquear Cuenta', link: '/desbloquearcuentascorreo' },
                        { label: 'Suspender Cuenta', link: '/suspendercuentascorreo'},
                    ] },
                ] },
                { label: 'Funcional', link: '#' , menuItems: [
                    {label: 'Pantalla', link: '#', menuItems: [
                        { label: 'Crear Pantalla', link: '/crearpantalla' },
                        { label: 'Revisar Pantalla', link: '/revisarpantalla' },
                        { label: 'Finalizar Pantalla', link: '/finalizarpantalla' },
                        { label: 'Asignar Pantalla', link: '/asignarpantalla' },
                    ]},
                    {label: 'Proceso', link: '#', menuItems: [
                        { label: 'Crear Proceso', link: '/crearproceso' },
                        { label: 'Asignar Proceso', link: '/asignarproceso' },
                    ]},
                ]},
                { label: 'Adquisiciones', link: '/adquisiciones', menuItems:[
                    { label: 'Ingresos', link: '/ingresos' },
                    { label: 'Proveedores', link: '/proveedores', menuItems: [
                        { label: 'Crear Proveedor', link: '/crear_proveedor', menuItems: [] },
                        { label: 'Consultar Proveedor', link: '/consultar_proveedor', menuItems: [] },
                    ]},
                    { label: 'Productos', link: '/productos', menuItems: [
                        { label: 'Reciclar', link: '/reciclaje'},
                        { label: 'Crear Producto', link: '/crear_producto'},
                        { label: 'Consultar Producto', link: '/consultar_producto' },
                    ]}
                ] }
            ] },
        ]}
    ];
    const renderMenuItems = (items: MenuItem[]) => {
        return items.map((item, index) => (
            <li key={index} className="ml-2 px-3 py-1 mt-2 bg-red-600 text-blue-900 rounded-full hover:bg-blue-950  hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1 hover:text-white">
                <Link to={item.link} className="flex items-center gap-2">
                    <button className=" outline-none focus:outline-none rounded-sm flex items-center min-w-32">
                        <span className="pr-1 font-semibold flex-1 text-blue-900 rounded-full hover:rounded-full hover:bg-blue-950 hover:p-1 hover:text-red-600 hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out">{item.label}</span>
                        {item.menuItems && item.menuItems.length > 0 && (
                            <span><IonIcon icon={chevronDownOutline} className="w-4 h-4 text-gray-500" /></span>                        
                        )}
                    </button>
                </Link>
                {item.menuItems && item.menuItems.length > 0 && (
                    <ul className="bg-white border rounded-sm absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32">
                        {renderMenuItems(item.menuItems)}
                    </ul>
                )}
            </li>
        ));
    };

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
                        {renderMenuItems(menuItems)}
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
    );
}
