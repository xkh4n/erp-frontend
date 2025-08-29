import { saveOutline, checkmarkOutline, trashOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toast, showApprovalToast, showRejectionToast, showErrorToast, showInfoToast } from '../../../../Components/Toast';
import { useAuth } from "../../../../Library/Context/AuthContext";

import { handleError } from "../../../../Library/Utils/errorHandler";

type Ccostos = {
    _id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
};


type Categorias = {
    _id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
};

type Producto = {
    _id: string;
    nombre: string;
    modelo: string;
    descripcion: string;
    categoria: string; // Assuming this is a string representing the category ID
};

type ElementoSolicitud = {
    id: string;
    nroSolicitud: string;
    tipoEquipamiento: string;
    tipoEquipamientoNombre: string;
    producto: string;
    productoNombre: string;
    cantidad: number;
};

export default function CrearSolicitud() {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken, isAuthenticated } = useAuth();
    
    // Función helper para manejo de errores con contexto fijo
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);
    const [nroSolicitud, setNroSolicitud] = useState("");
    const [solicitante, setSolicitante] = useState("");
    const [cargoSolicitante, setCargoSolicitante] = useState("");
    const [beneficiario, setBeneficiario] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [selectedCentroCosto, setSelectedCentroCosto] = useState("");
    const [emailSolicitante, setEmailSolicitante] = useState("");
    const [telefonoSolicitante, setTelefonoSolicitante] = useState("");
    const [telefonoBeneficiario, setTelefonoBeneficiario] = useState("");
    const [cuentaBeneficiario, setCuentaBeneficiario] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [centroCostos, setCentroCostos] = useState<Ccostos[]>([]);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [selectedProducto, setSelectedProducto] = useState("");
    const [elementosSolicitud, setElementosSolicitud] = useState<ElementoSolicitud[]>([]);


    // Cargar los centros de costos al montar el componente
    useEffect(() => {
        const fetchCentroCostos = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar centros de costo');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/ccosto/getall`,
                    {
                        page: 1,
                        limit: 9999,
                        sortBy: 'nombre',
                        sortOrder: 'asc'
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setCentroCostos(response.data.data.centros || []);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };
        
        if (isAuthenticated) {
            fetchCentroCostos();
        }
    }, [handleErrorWithContext, isAuthenticated, accessToken]);

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
                console.log("Se piden las categorias");
                setCategorias(response.data.data || []);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };
        
        if (isAuthenticated) {
            fetchCategorias();
        }
    }, [handleErrorWithContext, isAuthenticated, accessToken]);

    //Cargar los productos al seleccionar una categoría
    useEffect(() => {
        const fetchProductosByCategoria = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar productos');
                    return;
                }

                if (selectedCategoria && selectedCategoria.trim() !== "") {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/producto/idcategoria`,
                        { id: selectedCategoria },
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    if(response.data.data && response.data.data.length > 0) {
                        setProductos(response.data.data);
                    }else{
                        console.log("No se encontraron productos para la categoría seleccionada.");
                        setProductos([]);
                    }
                } else {
                    setProductos([]);
                }
            } catch (error) {
                showRejectionToast(error instanceof Error ? error.message : "Error al cargar los productos");
            }
        };
        
        if (isAuthenticated) {
            fetchProductosByCategoria();
        }
    }, [selectedCategoria, isAuthenticated, accessToken]);

    useEffect(() => {
        const creaSolicitud = async () => {
            try {
                const now = new Date();
                const pad = (n: number, width = 2) => n.toString().padStart(width, '0');
                const nro =
                    now.getFullYear().toString() +
                    pad(now.getMonth() + 1) +
                    pad(now.getDate()) +
                    pad(now.getHours()) +
                    pad(now.getMinutes()) +
                    pad(now.getSeconds()) +
                    pad(now.getMilliseconds(), 3);
                setNroSolicitud(nro);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };
        creaSolicitud();
    }, [handleErrorWithContext]);

    // Función para manejar el envío del formulario
    const handlerSubmit = async () => {
        try {
            // Validar que existan elementos en la solicitud
            if (elementosSolicitud.length === 0) {
                showErrorToast("Debe agregar al menos un elemento a la solicitud");
                return;
            }

            // Validar campos obligatorios del formulario principal
            if (!solicitante || !cargoSolicitante || !beneficiario || !selectedCentroCosto || 
                !emailSolicitante || !telefonoSolicitante || !telefonoBeneficiario || !cuentaBeneficiario) {
                showErrorToast("Por favor complete todos los campos obligatorios");
                return;
            }

            // Recorrer la tabla elementosSolicitud y mapear al formato requerido para detalleSolicitud
            const detalleSolicitud = elementosSolicitud.map((elemento) => ({
                tipoEquipamiento: elemento.tipoEquipamiento,
                producto: elemento.producto,
                cantidad: elemento.cantidad
            }));

            const dataSend = {
                "nroSolicitud": nroSolicitud,
                "solicitante": solicitante,
                "cargoSolicitante": cargoSolicitante,
                "beneficiario": beneficiario,
                "ccosto": selectedCentroCosto,
                "emailSolicitante": emailSolicitante,
                "telefonoSolicitante": telefonoSolicitante,
                "telefonoBeneficiario": telefonoBeneficiario,
                "cuentaBeneficiario": cuentaBeneficiario.toLowerCase(),
                "observaciones": observaciones,
                "detalleSolicitud": detalleSolicitud
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/solicitud/nueva`, dataSend,{
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            showApprovalToast(`Solicitud creada exitosamente con ${detalleSolicitud.length} elemento(s)`);
            resetForm();
            navigate("/crear_solicitud")
        } catch (error) {
            if (error instanceof Error) {
                showErrorToast(error.message);
            } else {
                showErrorToast("Error desconocido al procesar la solicitud");
                handleErrorWithContext(error);
            }
        }
    };

    // Función para manejar el botón agregar
    const handlerAgregar = () => {
        // Validar que todos los campos necesarios estén llenos
        if (!selectedCategoria || !selectedProducto || !cantidad || parseInt(cantidad) <= 0) {
            showErrorToast("Por favor complete todos los campos requeridos");
            return;
        }

        try {
            // Buscar los nombres de la categoría y producto seleccionados
            const categoriaSeleccionada = categorias.find(cat => cat._id === selectedCategoria);
            const productoSeleccionado = productos.find(prod => prod._id === selectedProducto);

            if (!categoriaSeleccionada || !productoSeleccionado) {
                showErrorToast("Error al obtener la información del producto o categoría");
                return;
            }

            // Crear nuevo elemento para la tabla
            const nuevoElemento: ElementoSolicitud = {
                id: Date.now().toString(), // ID único temporal
                nroSolicitud: nroSolicitud,
                tipoEquipamiento: selectedCategoria,
                tipoEquipamientoNombre: categoriaSeleccionada.nombre,
                producto: selectedProducto,
                productoNombre: productoSeleccionado.nombre,
                cantidad: parseInt(cantidad)
            };

            // Agregar el elemento a la lista
            setElementosSolicitud(prev => [...prev, nuevoElemento]);

            // Limpiar los campos después de agregar
            setSelectedCategoria("");
            setSelectedProducto("");
            setCantidad("");
            setProductos([]);

            showApprovalToast("Elemento agregado a la solicitud");
        } catch (error) {
            if (error instanceof Error) {
                showErrorToast(error.message);
            } else {
                showErrorToast("Error al agregar elemento");
            }
        }
    };

    // Función para eliminar un elemento de la tabla
    const eliminarElemento = (id: string) => {
        setElementosSolicitud(prev => prev.filter(elemento => elemento.id !== id));
        showApprovalToast("Elemento eliminado de la solicitud");
    };

    // Función para manejar doble click en una fila (cargar datos en los campos)
    const handleRowDoubleClick = (elemento: ElementoSolicitud) => {
        // Cargar los datos del elemento en los campos
        setSelectedCategoria(elemento.tipoEquipamiento);
        setSelectedProducto(elemento.producto);
        setCantidad(elemento.cantidad.toString());
        
        // Eliminar el elemento de la tabla
        setElementosSolicitud(prev => prev.filter(el => el.id !== elemento.id));
        
        // Cargar los productos de la categoría seleccionada
        const fetchProductosByCategoria = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar productos');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/producto/idcategoria`,
                    { id: elemento.tipoEquipamiento },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if(response.data.data && response.data.data.length > 0) {
                    setProductos(response.data.data);
                }
            } catch (error) {
                if (error instanceof Error) {
                    showErrorToast(error.message);
                } else {
                    showErrorToast("Error al cargar los productos");
                }
            }
        };
        fetchProductosByCategoria();
        
        showInfoToast("Elemento movido a edición - Modifique los datos y presione Agregar");
    };

    // Función para limpiar el formulario después del envío exitoso
    
    const resetForm = () => {
        setSolicitante("");
        setCargoSolicitante("");
        setBeneficiario("");
        setSelectedCentroCosto("");
        setEmailSolicitante("");
        setTelefonoSolicitante("");
        setTelefonoBeneficiario("");
        setCuentaBeneficiario("");
        setObservaciones("");
        setSelectedCategoria("");
        setSelectedProducto("");
        setCantidad("");
        setElementosSolicitud([]);
        setProductos([]);
        
        // Generar nuevo número de solicitud
        const now = new Date();
        const pad = (n: number, width = 2) => n.toString().padStart(width, '0');
        const nro =
            now.getFullYear().toString() +
            pad(now.getMonth() + 1) +
            pad(now.getDate()) +
            pad(now.getHours()) +
            pad(now.getMinutes()) +
            pad(now.getSeconds()) +
            pad(now.getMilliseconds(), 3);
        setNroSolicitud(nro);
    };
    
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4 md:p-5 lg:p-6 overflow-y-auto">
            <Toast autoClose={3000} theme="dark" className="custom-toast"/>
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
                    Crear Solicitud de Producto
                </h1>
                <form className="w-full">
                    <div className="grid grid-cols-1 max-[799px]:grid-cols-1  min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
                        {/* Solicitud */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="solicitud"
                            >
                                Solicitud
                            </label>
                            <input
                                id="solicitud"
                                name="solicitud"
                                disabled
                                value={nroSolicitud}
                                maxLength={17}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm"
                            />
                        </div>
                        {/* Solicitante */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-5">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="solicitante"
                            >
                                Solicitante
                            </label>
                            <input
                                id="solicitante"
                                name="solicitante"
                                value={solicitante}
                                onChange={(e) => setSolicitante(e.target.value.toUpperCase())}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el nombre del solicitante"
                            />
                        </div>
                        {/* Cargo Solicitante */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-5">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="cargo_solicitante"
                            >
                                Cargo Solicitante
                            </label>
                            <input
                                id="cargo_solicitante"
                                name="cargo_solicitante"
                                value={cargoSolicitante}
                                onChange={(e) => setCargoSolicitante(e.target.value.toUpperCase())}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el cargo del solicitante"
                            />
                        </div>
                        {/* Beneficiario */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-4 min-[1200px]:col-span-4 min-[1400px]:col-span-4">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="beneficiario"
                            >
                                Beneficiario
                            </label>
                            <input
                                id="beneficiario"
                                name="beneficiario"
                                value={beneficiario}
                                onChange={(e) => setBeneficiario(e.target.value.toUpperCase())}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el nombre del beneficiario"
                            />
                        </div>
                        {/* Gerencia */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="centro_costo"
                            >
                                Gerencia
                            </label>
                            <select
                                id="centro_costo"
                                name="centro_costo"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedCentroCosto}
                                onChange={(e) => setSelectedCentroCosto(e.target.value)}
                            >
                                <option value="">Seleccione su Centro de Costo</option>
                                {centroCostos.map((centroCosto) => (
                                    <option key={centroCosto._id} value={centroCosto._id}>
                                        {centroCosto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Categroría de Equipos */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="equipamiento"
                            >
                                Tipo de Equipamiento
                            </label>
                            <select
                                id="equipamiento"
                                name="equipamiento"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedCategoria}
                                onChange={(e) => setSelectedCategoria(e.target.value)}
                            >
                                <option value="">Seleccione la Categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria._id} value={categoria._id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Producto */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-3 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="producto"
                            >
                                Producto
                            </label>
                            <select
                                id="producto"
                                name="producto"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                required
                                value={selectedProducto}
                                onChange={(e) => setSelectedProducto(e.target.value)}
                            >
                                <option value="">Seleccione el Producto</option>
                                {productos.map((producto) => (
                                    <option key={producto._id} value={producto._id}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Cantidad */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-1 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="cantidad"
                            >
                                Cantidad
                            </label>
                            <input
                                id="cantidad"
                                name="cantidad"
                                type="number"
                                min="1"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese la cantidad"
                            />
                        </div>
                        {/* Email Solicitante */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-3">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="solicitante"
                            >
                                Email
                            </label>
                            <input
                                id="solicitante"
                                name="solicitante"
                                type="email"
                                autoComplete="email"
                                value={emailSolicitante}
                                onChange={(e) => setEmailSolicitante(e.target.value.toLowerCase())}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el Email del solicitante/beneficiario"
                            />
                        </div>
                        {/* Teléfono Solicitante */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-3 min-[1200px]:col-span-4 min-[1400px]:col-span-3">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="telefono_solicitante"
                            >
                                Teléfono Solicitante
                            </label>
                            <input
                                id="telefono_solicitante"
                                name="telefono_solicitante"
                                type="tel"
                                value={telefonoSolicitante}
                                onChange={(e) => setTelefonoSolicitante(e.target.value)}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el Teléfono del solicitante"
                            />
                        </div>
                        {/* Teléfono Beneficiario */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-3 min-[1200px]:col-span-5 min-[1400px]:col-span-3">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="telefono_beneficiario"
                            >
                                Teléfono Beneficiario
                            </label>
                            <input
                                id="telefono_beneficiario"
                                name="telefono_beneficiario"
                                type="tel"
                                value={telefonoBeneficiario}
                                onChange={(e) => setTelefonoBeneficiario(e.target.value)}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese el Teléfono del beneficiario"
                            />
                        </div>
                        {/* Cuenta Beneficiario */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-5 min-[1400px]:col-span-3">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="cuenta_beneficiario"
                            >
                                Cuenta Beneficiario
                            </label>
                            <input
                                id="cuenta_beneficiario"
                                name="cuenta_beneficiario"
                                type="text"
                                value={cuentaBeneficiario}
                                onChange={(e) => setCuentaBeneficiario(e.target.value)}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                                placeholder="Ingrese la Cuenta del beneficiario"
                            />
                        </div>
                        {/* Observaciones */}
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-6 min-[1000px]:col-span-8 min-[1200px]:col-span-10 min-[1400px]:col-span-12">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="observaciones"
                            >
                                Observaciones
                            </label>
                            <textarea
                                id="observaciones"
                                name="observaciones"
                                rows={4}
                                maxLength={500}
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value.toUpperCase())}
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm resize-none"
                                placeholder="Ingrese sus observaciones"
                            />
                        </div>
                    </div>
                    
                    {/* Tabla de elementos agregados */}
                    {elementosSolicitud.length > 0 && (
                        <div className="mt-8 mb-6 overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Elementos de la Solicitud
                            </h3>
                            <div className="overflow-x-auto shadow-lg rounded-lg">
                                <table className="w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="hidden min-[800px]:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Nro de Solicitud
                                            </th>
                                            <th className="hidden min-[1000px]:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Tipo de Equipamiento
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Producto
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Cantidad
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {elementosSolicitud.map((elemento, index) => (
                                            <tr 
                                                key={elemento.id}
                                                onDoubleClick={() => handleRowDoubleClick(elemento)}
                                                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                                }`}
                                                title="Doble click para editar (se moverá a los campos de edición)"
                                            >
                                                <td className="hidden min-[800px]:table-cell px-4 py-3 text-sm text-gray-900 border-b">
                                                    {elemento.nroSolicitud}
                                                </td>
                                                <td className="hidden min-[1000px]:table-cell px-4 py-3 text-sm text-gray-900 border-b">
                                                    {elemento.tipoEquipamientoNombre}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                    {elemento.productoNombre}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                    {elemento.cantidad}
                                                </td>
                                                <td className="px-4 py-3 text-sm border-b">
                                                    <button
                                                        onClick={() => eliminarElemento(elemento.id)}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                        title="Eliminar elemento"
                                                    >
                                                        <IonIcon icon={trashOutline} className="w-4 h-4 mr-1" />
                                                        Quitar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Total de elementos: {elementosSolicitud.length} | 
                                Doble click en una fila para editar (se moverá a los campos)
                                <span className="min-[800px]:hidden"> | Algunas columnas están ocultas en pantallas pequeñas</span>
                            </p>
                        </div>
                    )}

                    <div className="flex flex-1 row-auto justify-center gap-4">
                        <button
                            type="button"
                            onClick={handlerAgregar}
                            className="flex justify-center mt-5 items-center bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring py-2 w-60 rounded-full shadow-xl hover:shadow-green-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                        >
                            <IonIcon icon={checkmarkOutline} className="w-5 h-5" />
                            <p className="ml-1 text-lg">Agregar</p>
                        </button>
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
    );
}
