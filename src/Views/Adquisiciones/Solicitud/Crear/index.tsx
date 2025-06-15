import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    CustomError
} from "../../../../Library/Errores";

type ErrorState = {
        code: number;
        message: string;
        detail: string;
};

type Gerencia = {
    _id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    estado: boolean;
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

export default function CrearSolicitud() {
    console.log("Dentro de Solicitudes");
    const navigate = useNavigate();
    const [nroSolicitud, setNroSolicitud] = useState("");
    const [solicitante, setSolicitante] = useState("");
    const [cargoSolicitante, setCargoSolicitante] = useState("");
    const [beneficiario, setBeneficiario] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [selectedGerencia, setSelectedGerencia] = useState("");
    const [emailSolicitante, setEmailSolicitante] = useState("");
    const [telefonoSolicitante, setTelefonoSolicitante] = useState("");
    const [telefonoBeneficiario, setTelefonoBeneficiario] = useState("");
    const [cuentaBeneficiario, setCuentaBeneficiario] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [gerencias, setGerencias] = useState<Gerencia[]>([]);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [selectedProducto, setSelectedProducto] = useState("");

    // Cargar los productos al montar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/producto/categoria`,
                    { categoria: selectedCategoria }
                );
                console.log("Se piden los productos");
                setProductos(response.data.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        if (selectedCategoria && selectedCategoria.length === 5 && /^[a-zA-Z0-9]+$/.test(selectedCategoria)) {
            fetchProductos();
        }
    }, [selectedCategoria]);

    // Cargar las gerencias al montar el componente
    useEffect(() => {
        const fetchGerencias = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/gerencia/todas`
                );
                console.log("Se piden las gerencias");
                setGerencias(response.data.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchGerencias();
    }, []);

    // Cargar las categorías al montar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/categoria/todos`
                );
                console.log("Se piden las categorias");
                setCategorias(response.data.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchCategorias();
    }, []);

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
                handleError(error, navigate);
            }
        };
        creaSolicitud();
    }, []);

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
    // Función para manejar el envío del formulario
    const handlerSubmit = () => {
        // Aquí iría la lógica para manejar el envío del formulario
        try {
            toast.success("¡Solicitud Creada exitosamente!", {
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
                    progress: undefined,
                });
            } else {
                toast.error("Error desconocido al procesar la solicitud", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
            <ToastContainer aria-label="Notificaciones de la aplicación" />
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
                    Crear Solicitud de Producto
                </h1>
                <form className="w-full">
                    <div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-6 min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
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
                                value={selectedGerencia}
                                onChange={(e) => setSelectedGerencia(e.target.value)}
                            >
                                <option value="">Seleccione su Gerencia</option>
                                {gerencias.map((gerencia) => (
                                    <option key={gerencia._id} value={gerencia._id}>
                                        {gerencia.nombre}
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
                                onChange={(e) => setObservaciones(e.target.value)}
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm resize-none"
                                placeholder="Ingrese sus observaciones"
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
