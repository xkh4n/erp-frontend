import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CustomError } from "../../../../Library/Errores";


type ErrorState = {
    code: number;
    message: string;
    detail: string;
};

type Proveedor = {
    _id: string;
    razonSocial: string;
};

type Producto = {
    _id: string;
    nombre: string;
};
export default function IngresoProducto() {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [producto, setProducto] = useState<Producto[]>([]);


    const [selectedProveedor, setSelectedProveedor] = useState("");
    const [selectedProducto, setSelectedProducto] = useState("");
    const [nroSerie, setNroSerie] = useState("");

    useEffect(() => {
        // Aquí podrías hacer una llamada a la API para obtener los productos
        if (!selectedProveedor) {
            setProducto([]);
            return;
        }
        const fetchProductos = async () => {
            try {
                const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/producto/todos`
                );
                setProducto(response.data.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchProductos();
    }, [selectedProveedor]);

    useEffect(() => {
        // Aquí podrías hacer una llamada a la API para obtener los proveedores
        const fetchProveedores = async () => {
        try {
            const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/proveedor/todos`
            );
            setProveedores(response.data.data);
        } catch (error) {
            handleError(error, navigate);
        }
        };
        fetchProveedores();
    }, []);

    const handlerSubmit = () => {
        // Aquí iría la lógica para manejar el envío del formulario
        try {
            toast.success("¡Producto guardado exitosamente!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
                });
            } else {
                toast.error("Error desconocido al procesar la solicitud", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
                });
            }
        }
    };
    // Manejo de errores genérico
    // Esta función maneja los errores y redirige a una página de error con el estado adecuado
    function handleError(
        error: unknown,
        navigate: (path: string, options?: { state: ErrorState }) => void
    ) {
        if (error instanceof CustomError) {
            const errorData = error.toJSON();
            navigate("/error", {
                state: {
                code: errorData.code,
                message: errorData.message,
                detail: errorData.details
                }
            });
        } else if (error instanceof axios.AxiosError) {
            navigate("/error", {
                state: {
                code: error.response?.status || 500,
                message: error.message || "Network Error",
                detail: error.response?.statusText || "Unknown error"
                }
            });
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
        <ToastContainer aria-label="Notificaciones de la aplicación" />
        <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
            Ingreso de Producto
            </h1>
            <form className="w-full">
            <div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-6 min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-1 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="cbo_proveedor"
                    >
                        Proveedor
                    </label>
                    <select
                        id="cbo_proveedor"
                        name="cbo_proveedor"
                        value={selectedProveedor}
                        onChange={(e) => setSelectedProveedor(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Seleccione el Proveedor</option>
                        {proveedores.map((proveedor) => (
                        <option key={proveedor._id} value={proveedor._id}>
                            {proveedor.razonSocial}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-1 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="cbo_producto"
                    >
                        Producto
                    </label>
                    <select
                        id="cbo_producto"
                        name="cbo_producto"
                        value={selectedProducto}
                        onChange={(e) => setSelectedProducto(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Seleccione el Producto</option>
                        {producto.map((productos) => (
                        <option key={productos._id} value={productos._id}>
                            {productos.nombre}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-3 min-[1400px]:col-span-4">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="nro_serie"
                    >
                        Código/Serie
                    </label>
                    <input
                        id="nro_serie"
                        type="text"
                        name="nro_serie"
                        value={nroSerie}
                        onChange={(e) => setNroSerie(e.target.value.toUpperCase())}
                        placeholder="Ingrese el código o número de serie"
                        className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm"
                    />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-1 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="telefono"
                >
                    Teléfono
                </label>
                <input
                    id="telefono"
                    type="tel"
                    name="telefono"
                    className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-5 min-[1200px]:col-span-5 min-[1400px]:col-span-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Correo
                </label>
                <input
                    id="email"
                    type="email"
                    name="correo"
                    className="w-full border rounded px-3 py-2"
                    required
                />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-3 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="cbo_pais"
                >
                    País
                </label>
                <select
                    id="cbo_pais"
                    name="cbo_pais"
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Seleccione un país</option>
                </select>
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="cbo_ciudad"
                >
                    Ciudad
                </label>
                <select
                    id="cbo_ciudad"
                    name="cbo_ciudad"
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Seleccione una ciudad</option>
                </select>
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="cbo_comuna"
                >
                    Comuna
                </label>
                <select
                    id="cbo_comuna"
                    name="cbo_comuna"
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Seleccione una comuna</option>
                </select>
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-4 min-[1200px]:col-span-6 min-[1400px]:col-span-4">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="direccion"
                >
                    Dirección
                </label>
                <input
                    id="direccion"
                    type="text"
                    name="direccion"
                    className="w-full border rounded px-3 py-2"
                    required
                />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="fecha_creacion"
                >
                    Fecha de Creación
                </label>
                <input
                    id="fecha_creacion"
                    type="date"
                    name="fechaCreacion"
                    className="w-full border rounded px-3 py-2"
                    readOnly
                />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-4 min-[1200px]:col-span-6 min-[1400px]:col-span-6">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="contacto"
                >
                    Contacto
                </label>
                <input
                    id="contacto"
                    type="text"
                    name="contacto"
                    className="w-full border rounded px-3 py-2"
                    required
                />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="fono_contacto"
                >
                    Fono Contacto
                </label>
                <input
                    id="fono_contacto"
                    type="text"
                    name="fono_contacto"
                    className="w-full border rounded px-3 py-2"
                    required
                />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-1 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="tipoServicio"
                >
                    Tipo Servicio
                </label>
                <select
                    id="tipoServicio"
                    name="tipoServicio"
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value=""> </option>
                    <option value="compra">Compras</option>
                    <option value="arriendo">Arriendo</option>
                </select>
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-1 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="estado"
                >
                    Estado
                </label>
                <select
                    id="estado"
                    name="estado"
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value=""></option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="condicionesPago"
                >
                    Condiciones de Pago
                </label>
                <input
                    id="condicionesPago"
                    type="text"
                    name="condicionesPago"
                    className="w-full border rounded px-3 py-2"
                    required
                />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="condicionesEntrega"
                >
                    Condiciones de Entrega
                </label>
                <input
                    id="condicionesEntrega"
                    type="text"
                    name="condicionesEntrega"
                    className="w-full border rounded px-3 py-2"
                    required
                />
                </div>
                <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="condicionesDespacho"
                >
                    Condiciones de Despacho
                </label>
                <input
                    id="condicionesDespacho"
                    type="text"
                    name="condicionesDespacho"
                    className="w-full border rounded px-3 py-2"
                    required
                />
                </div>
            </div>
            <div className="flex flex-1 row-auto justify-center">
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
