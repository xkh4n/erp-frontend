import { Toast/*, showApprovalToast, showRejectionToast, showErrorToast, showInfoToast*/ } from '../../../../Components/Toast';
import { useState, useCallback, useEffect } from 'react';
import { searchCircleOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../../../../Library/Context/AuthContext";
import { handleError } from "../../../../Library/Utils/errorHandler";
import { useCategorias, useProveedores, useCentrosCosto } from "../../../../Library/Hooks/Models";


type Producto = {
    _id: string;
    nombre: string;
    modelo: string;
};

type InventarioItem = {
    _id: string;
    inventoryCode?: string;
    producto: {
        _id: string;
        nombre: string;
        modelo?: string;
        marca?: string;
        descripcion?: string;
        categoria?: string;
    } | string;
    serialNumber: string;
    centroCosto: {
        _id: string;
        nombre: string;
        codigo?: string;
        descripcion?: string;
    } | string;
    proveedor?: {
        _id: string;
        razonSocial: string;
        rut?: string;
        giro?: string;
        telefono?: string;
    } | string;
    assignedUser?: {
        _id: string;
        nombre: string;
    } | string;
    status?: {
        _id: string;
        nombre: string;
        descripcion?: string;
        codigoestado?: number;
    } | string;
    location?: string;
    nroSolicitud?: string;
    numeroDocumento?: string;
    tipoDocumento?: string;
    expirationDate?: string;
    validityType?: string;
    validityValue?: number;
    value?: number;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
};

interface FiltroInventario {
    productoId?: string;
    numeroSerie?: string;
    centroCosto?: string;
    proveedorId?: string;
    usuarioId?: string;
    categoriaId?: string;
    todos?: boolean;
}

export default function ConsultaInventario() {
    const navigate = useNavigate();
    const location = useLocation();

    const { centrosCostos } = useCentrosCosto();
    const [selectedCentroCosto, setSelectedCentroCosto] = useState('');

    const { proveedores } = useProveedores();
    const [selectedProveedor, setSelectedProveedor] = useState('');

    const { categorias } = useCategorias();
    const [selectedCategoria, setSelectedCategoria] = useState('');

    const [productos, setProductos] = useState<Producto[]>([]);
    const [selectedProducto, setSelectedProducto] = useState('');

    const [nroSerie, setNroSerie] = useState('');
    const [inventario, setInventario] = useState<InventarioItem[]>([]);
    const [loading, setLoading] = useState(false);

    const { accessToken, isAuthenticated } = useAuth();

    // Función helper para manejo de errores con contexto fijo
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);


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


    const handlerSubmit = useCallback(async () => {
        setLoading(true);
        try {
            // Construimos el cuerpo de la petición con los filtros seleccionados
            const body: FiltroInventario = {};
            
            // Añadimos los filtros solo si están seleccionados
            if (selectedCentroCosto) {
                const centroCosto = centrosCostos.find(cc => cc.nombre === selectedCentroCosto);
                if (centroCosto) body.centroCosto = centroCosto._id;
            }
            
            if (selectedProveedor) {
                const proveedor = proveedores.find(p => p.razonSocial === selectedProveedor);
                if (proveedor) body.proveedorId = proveedor._id;
            }
            
            if (selectedProducto) {
                const producto = productos.find(p => p.nombre === selectedProducto);
                if (producto) body.productoId = producto._id;
            }
            
            if (nroSerie) {
                body.numeroSerie = nroSerie;
            }

            if (selectedCategoria) {
                const categoria = categorias.find(c => c.codigo === selectedCategoria);
                if (categoria) {
                    body.categoriaId = categoria._id;
                } else {
                    console.log('No se encontró categoría con código:', selectedCategoria);
                }
            }
            
            // Si no hay ningún filtro seleccionado, traemos todos los registros
            if (!selectedCentroCosto && !selectedProveedor && !selectedProducto && !nroSerie && !selectedCategoria) {
                body.todos = true;
            }
            
            // Realizamos la consulta al backend
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/inventario/filtrar`,
                body,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Guardamos los resultados en el estado
            setInventario(response.data.data || []);
        } catch (error) {
            handleErrorWithContext(error);
            console.error('Error al cargar inventario:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedCentroCosto, centrosCostos, selectedProveedor, proveedores, selectedProducto, productos, nroSerie, selectedCategoria, categorias, accessToken, handleErrorWithContext]);


    // Efecto para leer query parameters y aplicar filtros automáticamente
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoriaParam = searchParams.get('categoria');
        
        if (categoriaParam && categorias.length > 0) {
            // Buscar la categoría por código
            const categoria = categorias.find(c => c.codigo === categoriaParam);
            if (categoria) {
                setSelectedCategoria(categoriaParam);
                
                // Auto-ejecutar búsqueda con el filtro aplicado
                setTimeout(() => {
                    handlerSubmit();
                }, 500); // Pequeño delay para asegurar que los datos estén cargados
            }
        }
    }, [location.search, categorias, handlerSubmit]); // Se ejecuta cuando cambian los query params o las categorías

    
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 p-4 md:p-5 lg:p-6">
            <Toast autoClose={3000} theme="dark" className="custom-toast"/>
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center pb-8">Consulta de Inventario</h1>
                <form className="w-full">
                    <div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-8  min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-8 min-[1400px]:grid-cols-12 gap-4">
                        {/* Centros de Costos */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-4 min-[1200px]:col-span-4 min-[1400px]:col-span-2">
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
                                {centrosCostos.map((centroCostos) => (
                                    <option key={centroCostos._id} value={centroCostos.nombre}>
                                        {centroCostos.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Proveedor */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-4 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
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
                        {/* Categorias */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-3 min-[1400px]:col-span-2">
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
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-3 min-[1400px]:col-span-2">
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
                        {/* Label Nro de Serie */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
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
                    </div>
                    <div className="flex flex-1 row-auto  justify-center">
                        <button
                            type="button"
                            onClick={handlerSubmit}
                            className="flex justify-center mt-5 items-center bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-white focus:outline-none focus:ring py-2 w-60 rounded-full shadow-xl hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                        >
                            <IonIcon icon={searchCircleOutline} className="w-5 h-5" />
                            <p className="ml-1 text-lg">Buscar</p>
                        </button>
                    </div>
                </form>
                
                {/* Indicador de carga */}
                {loading && (
                    <div className="flex justify-center my-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                    </div>
                )}
                
                {/* Tabla de resultados del inventario */}
                {!loading && inventario.length > 0 && (
                    <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-950 text-white">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Producto</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Serie</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Centro de Costo</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Proveedor</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Modelo</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Valor</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventario.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {typeof item.producto === 'object' ? item.producto.nombre : '—'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {item.serialNumber || '—'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {item.location || '—'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {typeof item.proveedor === 'object' ? item.proveedor.razonSocial : '—'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {typeof item.producto === 'object' ? item.producto.modelo : '—'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {typeof item.status === 'object' ? item.status.nombre : '—'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {item.value ? `$${item.value.toLocaleString()}` : '—'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Mensaje cuando no hay resultados */}
                {!loading && inventario.length === 0 && (
                    <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
                        <p className="text-gray-500">No se encontraron resultados. Intenta con otros criterios de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}