import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import './index.css';

type MenuItem = {
    label: string;
    link: string;
    menuItems?: MenuItem[];
};

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Cerrar menú cuando se redimensiona la pantalla a >= 1200px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1200) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const menuItems: MenuItem[] = [
        { label: 'Home', link: '/' },
        { label: 'Contacto', link: '/contacto'},
        { label: 'Registro', link: '/registro'},
        { label: 'Sistemas', link: '#', menuItems: [
            { label: 'Desarrollo', link: '#' },
            { label: 'Presupuesto', link: '#' },
            { label: 'Produccion', link: '#', menuItems:[
                { label: 'Centralizado', link: '#', menuItems: [
                    { label: 'Solicitudes', link: '#', menuItems: [
                        { label: 'Crear Solicitud', link: '/crearsolicitud' },
                        { label: 'Revisar Solicitud', link: '/revisarsolicitud' },
                        { label: 'Finalizar Solicitud', link: '/finalizarsolicitud' },
                    ] },
                    { label: 'Cuentas NT', link: '#', menuItems: [
                        { label: 'Crear Cuenta', link: '/crearcuentasnt'},
                        { label: 'Desbloquear Cuenta', link: '/desbloquearcuentasnt' },
                        { label: 'Suspender Cuenta', link: '/suspendercuentasnt'},
                    ] },
                    { label: 'Cuentas Correo', link: '#', menuItems: [
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
                { label: 'Adquisiciones', link: '#', menuItems:[
                    { label: 'Ingresos', link: '/ingresos' },
                    { label: 'Categorías', link: '#', menuItems: [
                        { label: 'Nueva', link: '/crear_categoria'}
                    ]},
                    { label: 'Proveedores', link: '#', menuItems: [
                        { label: 'Crear Proveedor', link: '/crear_proveedor' },
                        { label: 'Consultar Proveedor', link: '/consultar_proveedor'},
                    ]},
                    { label: 'Productos', link: '#', menuItems: [
                        { label: 'Reciclar', link: '/reciclaje'},
                        { label: 'Agregar', link: '/agregar_producto'},
                        { label: 'Crear Producto', link: '/crear_producto'},
                        { label: 'Consultar Producto', link: '/consultar_producto' },
                    ]},
                    { label: 'Solicitud', link: '#', menuItems: [
                        { label: 'Solicitar', link: '/crear_solicitud'},
                        { label: 'Autorizar', link: '/autorizar_solicitud'},
                        { label: 'Cancelar', link: '/cancelar_solicitud' },
                    ]},
                    { label: 'Inventario', link: '#', menuItems: [
                        { label: 'Ingresos', link: '/inventario_ingresos'},
                        { label: 'Consultar Inventario', link: '/consultar_inventario'},
                    ]},
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

    const renderMobileMenuItems = (items: MenuItem[]) => {
        return items.map((item) => (
            <li key={item.label} className="block">
                {item.menuItems && item.menuItems.length > 0 ? (
                    <MobileMenuWithSubmenu item={item} />
                ) : (
                    <Link 
                        to={item.link} 
                        className="block px-4 py-2 text-blue-950 font-bold hover:bg-red-100 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {item.label}
                    </Link>
                )}
            </li>
        ));
    }

    const MobileMenuWithSubmenu = ({ item }: { item: MenuItem }) => {
        const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

        return (
            <div>
                <button
                    className="w-full text-left px-4 py-2 text-blue-950 font-bold hover:bg-red-100 rounded-lg flex items-center justify-between"
                    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                >
                    <span>{item.label}</span>
                    <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isSubmenuOpen && item.menuItems && (
                    <ul className="ml-4 mt-2 space-y-1">
                        {item.menuItems.map((subItem) => (
                            <li key={subItem.label}>
                                {subItem.menuItems && subItem.menuItems.length > 0 ? (
                                    <MobileMenuWithSubmenu item={subItem} />
                                ) : (
                                    <Link
                                        to={subItem.link}
                                        className="block px-4 py-2 text-blue-950 hover:bg-red-50 rounded-lg text-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {subItem.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <nav className="bg-white shadow shadow-gray-300 w-100 px-4 h-14 flex items-center">
            <div className="w-full mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-blue-950 flex items-center gap-2">
                    <img src="/images/imperial.png" alt="Logo" className="h-12 w-12 rounded-full" />
                    <span className="text-2xl font-bold">
                        <img src="/images/imperial_letras.png" alt="Logo" className="h-5" />
                    </span>
                </div>

                {/* Hamburger Button - visible on screens < 1200px */}
                <button 
                    className="xl:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger-line block w-6 h-0.5 bg-blue-950 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`hamburger-line block w-6 h-0.5 bg-blue-950 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`hamburger-line block w-6 h-0.5 bg-blue-950 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                {/* Desktop Menu - visible on screens >= 1200px */}
                <div className="hidden xl:flex text-blue-950 font-bold">
                    <ul className="flex items-center space-x-2">
                        {renderMenuItems(menuItems)}
                    </ul>
                </div>

                {/* Login Button - always visible */}
                <div className="hidden xl:block">
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

            {/* Mobile Menu - visible when hamburger is clicked and screen < 1200px */}
            <div className={`xl:hidden fixed top-14 left-0 w-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
                <div className="mobile-menu p-4">
                    <ul className="space-y-2">
                        {renderMobileMenuItems(menuItems)}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full px-4 py-2 bg-blue-950 hover:bg-red-600 text-gray-50 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200">
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