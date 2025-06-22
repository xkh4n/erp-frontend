import { Link } from "react-router-dom";
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
                    ]},
                    { label: 'Solicitud', link: '#', menuItems: [
                        { label: 'Solicitar', link: '/crear_solicitud'},
                        { label: 'Autorizar', link: '/autorizar_solicitud'},
                        { label: 'Cancelar', link: '/cancelar_solicitud' },
                    ]}
                ] }
            ] },
        ]}
    ];

    const menulvl1ConSubmenu = (label: string, menuItems: MenuItem[]) => {
        return (
            <li key={label} className="relative px-3 py-1 group/submenu text-center mt-2 rounded-full bg-red-600 hover:bg-red-300">
                <button className="w-full text-left flex items-center outline-none focus:outline-none rounded-full">
                    <span className="pr-1 flex-1 text-blue-950 font-bold">{label}</span>
                    <span className="mr-auto">
                        <svg className="fill-blue-600 h-4 w-4 transition duration-150 ease-in-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </span>
                </button>
                <ul className="bg-transparent absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32 invisible group-hover/submenu:visible">
                    {menuItems.map((item) => (
                        item.menuItems && item.menuItems.length > 0 
                            ? menulvl1ConSubmenu(item.label, item.menuItems)
                            : menulvl0SinSubmenu(item.label, item.link, false)
                    ))}
                </ul>
            </li>
        );
    }

    const menulvl0ConSubmenu = (label: string, menuItems: MenuItem[]) => {
        return (
            <li key={label} className="inline-block relative group/menu rounded-full mt-2 bg-red-600 hover:bg-red-300">
                <button className="outline-none focus:outline-none px-3 py-1 rounded-full flex items-center min-w-40">
                    <span className="pr-1 flex-1 text-blue-950 font-bold">{label}</span>
                    <span>
                        <svg className="fill-blue-600 h-4 w-4 transform group-hover/menu:-rotate-180 transition duration-150 ease-in-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </span>
                </button>
                <ul className="bg-transparent rounded-sm transform scale-0 group-hover/menu:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32">
                    {menuItems.map((item) => (
                        item.menuItems && item.menuItems.length > 0 
                            ? menulvl1ConSubmenu(item.label, item.menuItems)
                            : menulvl0SinSubmenu(item.label, item.link, false)
                    ))}
                </ul>
            </li>
        );
    }

    const menulvl0SinSubmenu = (label:string, link:string, isFirstLevel:boolean = true) => {
        return (
            <li key={label} className={isFirstLevel 
                ? "inline-block px-3 py-1 bg-red-600 m-2 mt-2 min-w-40 rounded-full text-blue-950 font-bold text-center hover:bg-red-300" 
                : "outline-none focus:outline-none px-3 mt-2 py-1 bg-red-600 rounded-full flex items-center min-w-40 text-blue-950 font-bold text-center hover:bg-red-300"}>
                <Link to={link}>
                    {label}
                </Link>
            </li>
        );
    }

    const renderMenuItems = (items: MenuItem[]) => {
        return items.map((item) => (
            item.menuItems && item.menuItems.length > 0 
                ? menulvl0ConSubmenu(item.label, item.menuItems)
                : menulvl0SinSubmenu(item.label, item.link)
        ));
    }

    return (
        <nav className="bg-white shadow shadow-gray-300 w-100 px-50 h-14 md:px-auto flex items-center">
            <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
                <div className="text-blue-950 md:order-1 flex items-center gap-2">
                    <img src="/images/imperial.png" alt="Logo" className="h-16 w-16 md:h-12 md:w-12 rounded-full" />
                    <span className="text-2xl font-bold">
                        <img src="/images/imperial_letras.png" alt="Logo" className="h-5" />
                    </span>
                </div>
                <div className="text-blue-950 font-bold order-3 w-full md:w-auto md:order-2">
                    <ul>
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
