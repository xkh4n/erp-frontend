import { Link } from "react-router-dom";
import { chevronDownOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useState } from 'react';
import './index.css';

type MenuItem = {
    label: string;
    link: string;
    menuItems?: MenuItem[];
};

export default function index() {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
    
    const menuItems: MenuItem[] = [
        { label: 'Home', link: '/' },
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
        ]},
        { label: 'Contacto', link: '/contacto'},
        { label: 'Registro', link: '/registro'},
    ];
    const toggleMenu = (index: string) => {
        setOpenMenus(prev => {
            // Si el menú ya está abierto, solo lo cerramos
            if (prev[index]) {
                return {
                    ...prev,
                    [index]: false
                };
            }
            
            // Si el menú está cerrado, cerramos todos los demás y abrimos este
            const newState = {};
            Object.keys(prev).forEach(key => {
                newState[key] = false;
            });
            return {
                ...newState,
                [index]: true
            };
        });
    };
    const renderMenuItems = (items: MenuItem[], level = 0) => {
        return items.map((item, index) => {
            const menuKey = `menu-${level}-${index}`;
            return (
                <li key={index} className="relative inline-block text-left">
                    <div className="flex items-center">
                        <button 
                            onClick={() => item.menuItems && toggleMenu(menuKey)}
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                        >
                            <span>{item.label}</span>
                            {item.menuItems && item.menuItems.length > 0 && (
                                <IonIcon icon={chevronDownOutline} className="w-5 h-5 ml-2" />
                            )}
                        </button>
                    </div>
                    {item.menuItems && item.menuItems.length > 0 && openMenus[menuKey] && (
                        <div className={`absolute ${level === 0 ? 'left-0 top-full' : 'left-full top-0'} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 px-2 py-2 z-50`}>
                            {renderMenuItems(item.menuItems, level + 1)}
                        </div>
                    )}
                </li>
            );
        });
    };

    return (
        <nav className="bg-gray-100 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <img src="/images/imperial.png" alt="Logo" className="h-12 w-12 rounded-full" />
                        <img src="/images/imperial_letras.png" alt="Logo" className="h-5 ml-2" />
                    </div>
                    <div className="flex items-center">
                        <ul className="flex space-x-4">
                            {renderMenuItems(menuItems)}
                        </ul>
                        <Link to="/login" className="ml-4">
                            <button className="px-4 py-2 bg-blue-950 hover:bg-red-600 text-white rounded-md flex items-center gap-2 transition-colors duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Login</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
