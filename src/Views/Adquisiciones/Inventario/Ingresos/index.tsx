import { saveOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { Toast/*, showApprovalToast, showRejectionToast, showErrorToast, showInfoToast*/ } from '../../../../Components/Toast';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../../../../Library/Context/AuthContext";
import { handleError } from "../../../../Library/Utils/errorHandler";
import NewDatePicker from '../../../../Components/NewDatePicker';


type Categoria = {
    _id: string;
    codigo: string;
    nombre: string;
};

type Producto = {
    _id: string;
    nombre: string;
    modelo: string;
};

type CentroCosto = {
    _id: string;
    codigo: number;
    nombre: string;
};

type Proveedor = {
    _id: string;
    razonSocial: string;
};

export default function IngresoInventario() {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken, isAuthenticated } = useAuth();

    // Función helper para manejo de errores con contexto fijo
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);


    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [centrosCostos, setCentrosCostos] = useState<CentroCosto[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [selectedProducto, setSelectedProducto] = useState('');
    const [selectedCentroCosto, setSelectedCentroCosto] = useState('');
    const [selectedProveedor, setSelectedProveedor] = useState('');
    const [nroSerie, setNroSerie] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState<Date | null>(new Date());

    // Cargar las categorías al montar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar categorías');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/categoria/todos`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                /** Entregar Categorias ordenadas por nombre */
                setCategorias(response.data.data.sort((a: Categoria, b: Categoria) => a.nombre.localeCompare(b.nombre)) || []);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };
        
        if (isAuthenticated) {
            fetchCategorias();
        }
    }, [handleErrorWithContext, isAuthenticated, accessToken]);

    /* Cargar Centros de Costo */
    useEffect(() => {
        const fetchCentrosCostos = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar centros de costo');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/ccosto/getall`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                /** Entregar Centros de Costo ordenados por nombre */
                setCentrosCostos(response.data.data.centros.sort((a: CentroCosto, b: CentroCosto) => a.nombre.localeCompare(b.nombre)) || []);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };

        if (isAuthenticated) {
            fetchCentrosCostos();
        }
    }, [handleErrorWithContext, isAuthenticated, accessToken]);

    // Función para cargar productos solo cuando se selecciona una categoría
    const handleCategoriaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoriaId = e.target.value;
        setSelectedCategoria(categoriaId);
        setProductos([]);
        setSelectedProducto("");
        if (!categoriaId) return;
        if (!isAuthenticated || !accessToken) {
            console.warn('Usuario no autenticado para cargar productos');
            return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/producto/categoria`,
                { "categoria": categoriaId },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setProductos(response.data.data.sort((a: Producto, b: Producto) => a.nombre.localeCompare(b.nombre)) || []);
        } catch (error) {
            handleErrorWithContext(error);
        }
    };

    // Cargar Proveedores
    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar proveedores');
                    return;
                }
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/proveedor/todos`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                /** Entregar Proveedores ordenados por razon social */
                setProveedores(response.data.data.sort((a: Proveedor, b: Proveedor) => a.razonSocial.localeCompare(b.razonSocial)) || []);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };

        if (isAuthenticated) {
            fetchProveedores();
        }
    }, [handleErrorWithContext, isAuthenticated, accessToken]);

    const handlerSubmit = async () => {

        // Implement form submission logic here
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 p-4 md:p-5 lg:p-6">
            <Toast autoClose={3000} theme="dark" className="custom-toast"/>
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center pb-8">Ingreso de Inventario</h1>
                <form className="w-full">
                    {/* Form fields go here */}
                    <div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-6  min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-10 gap-4">
                        {/* Datepicker */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="fechaIngreso"
                            >
                                Fecha de Ingreso
                            </label>
                            <NewDatePicker
                                id="fechaIngreso"
                                name="fechaIngreso"
                                selected={fechaIngreso}
                                onChange={setFechaIngreso}
                                required
                            />
                        </div>
                        {/* Categorias */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-3 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="categorias"
                            >
                                Categoria del Producto
                            </label>
                            <select
                                id="categorias"
                                name="categorias"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedCategoria}
                                onChange={handleCategoriaChange}
                            >
                                <option value="">Seleccione una Categoria</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria._id} value={categoria.codigo}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Productos */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-5 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="productos"
                            >
                                Producto
                            </label>
                            <select
                                id="productos"
                                name="productos"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedProducto}
                                onChange={(e) => setSelectedProducto(e.target.value)}
                            >
                                <option value="">Seleccione un Producto</option>
                                {productos.map((producto) => (
                                    <option key={producto._id} value={producto.nombre}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Centros de Costos */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-3 min-[1400px]:col-span-4">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="centrosCostos"
                            >
                                Centro de Costo
                            </label>
                            <select
                                id="centrosCostos"
                                name="centrosCostos"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedCentroCosto}
                                onChange={(e) => setSelectedCentroCosto(e.target.value)}
                            >
                                <option value="">Seleccione un Centro de Costo</option>
                                {centrosCostos.map((centroCosto) => (
                                    <option key={centroCosto._id} value={centroCosto.nombre}>
                                        {centroCosto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Label Nro de Serie */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-3 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="nroSerie"
                            >
                                Nro de Serie
                            </label>
                            <input
                                id="nroSerie"
                                name="nroSerie"
                                type="text"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={nroSerie}
                                onChange={(e) => setNroSerie(e.target.value.toUpperCase())}
                            />
                        </div>
                        {/* Proveedor */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-8">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="proveedor"
                            >
                                Proveedor
                            </label>
                            <select
                                id="proveedor"
                                name="proveedor"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedProveedor}
                                onChange={(e) => setSelectedProveedor(e.target.value)}
                            >
                                <option value="">Seleccione un Proveedor</option>
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor._id} value={proveedor.razonSocial}>
                                        {proveedor.razonSocial}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-1 row-auto  justify-center">
                        <button
                            type="button"
                            onClick={handlerSubmit}
                            className="flex justify-center mt-5 items-center bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-white focus:outline-none focus:ring py-2 w-60 rounded-full shadow-xl hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                        >
                            <IonIcon icon={saveOutline} className="w-5 h-5" />
                            <p className="ml-1 text-lg">Guardar</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
