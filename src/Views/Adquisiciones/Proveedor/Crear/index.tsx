import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { IsBoolean, IsEmail, IsParagraph, IsPhone, IsRut } from "../../../../Library/Validations";
import { createValidationError } from "../../../../Library/Errores";
import { handleError } from "../../../../Library/Utils/errorHandler";
import { saveOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../Library/Context/AuthContext";

type country = {
        _id: string;
        iso_code: string;
        iata_code: string;
        name_country: string;
};

type city = {
        _id: string;
        iata_codes: string;
        name_city: string;
};

type estado = {
        _id: string;
        cod_territorial: string;
        cod_postal: string;
        name_comuna: string;
        cod_sii: string;
        ciudad: string; // Assuming this is a reference to a city
};

export default function CrearProveedor() {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken, isAuthenticated } = useAuth();

    // Función helper para manejo de errores con contexto fijo
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);

    const [paises, setPaises] = useState<country[]>([]);
    const [ciudades, setCiudades] = useState<city[]>([]);
    const [comunas, setComunas] = useState<estado[]>([]);
    const [selectedPais, setSelectedPais] = useState("");
    const [selectedCiudad, setSelectedCiudad] = useState("");
    const [selectedComuna, setSelectedComuna] = useState("");

    const [rut, setRut] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [giro, setGiro] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [fechaCreacion, setFechaCreacion] = useState(new Date().toISOString().split("T")[0]);
    const [contacto, setContacto] = useState("");
    const [fonoContacto, setFonoContacto] = useState("");
    const [tipoServicio, setTipoServicio] = useState("");
    const [estado, setEstado] = useState("");
    const [condicionesPago, setCondicionesPago] = useState("");
    const [condicionesEntrega, setCondicionesEntrega] = useState("");
    const [condicionesDespacho, setCondicionesDespacho] = useState("");

    useEffect(() => {
        const fetchPaises = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar países');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/pais/todos`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setPaises(response.data.data);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };
        fetchPaises();
    }, [handleErrorWithContext, isAuthenticated, accessToken]);

    useEffect(() => {
        if (!selectedPais) {
            setCiudades([]);
            return;
        }
        const fetchCiudades = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar ciudades');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/ciudad/citybycountry`,
                    { country: selectedPais },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setCiudades(response.data.data);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };
        fetchCiudades();
    }, [selectedPais, handleErrorWithContext, isAuthenticated, accessToken]);

    useEffect(() => {
        if (!selectedCiudad) {
            setComunas([]);
            return;
        }
        const fetchComunas = async () => {
            try {
                if (!isAuthenticated || !accessToken) {
                    console.warn('Usuario no autenticado para cargar comunas');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/comuna/ciudad`,
                    { ciudad: selectedCiudad },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setComunas(response.data.data);
            } catch (error) {
                handleErrorWithContext(error);
            }
        };
        fetchComunas();
    }, [selectedCiudad, handleErrorWithContext, isAuthenticated, accessToken]);

    const validateField = (fieldValue: string) => {
            if (!IsParagraph(fieldValue) || fieldValue === "") {
                return true
            }else{
                return false
            }
    };

    function formatRut(value: string) {
        // Eliminar todo lo que no sea número o K/k
        let clean = value.replace(/[^0-9kK]/g, '').toUpperCase();
        // Limitar a 9 caracteres (8 números + 1 dígito verificador)
        clean = clean.slice(0, 9);
        // Separar cuerpo y dígito verificador
        let cuerpo = clean.slice(0, -1);
        const dv = clean.slice(-1);
        // Agregar puntos cada 3 dígitos desde la derecha
        cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        // Unir con guion si hay dígito verificador
        return dv ? `${cuerpo}-${dv}` : cuerpo;
    }
    const handlerSubmit = async () => {
        try {
            if(IsRut(rut) === false){
                throw createValidationError(
                    "Error al Validar el Rut: ",
                    rut
                );
            }
            if(IsPhone(telefono) === false){
                throw createValidationError(
                    "Error al Validar el Teléfono: ",
                    telefono
                );
            }
            if(IsEmail(correo) === false){
                throw createValidationError(
                    "Error al Validar el Correo: ",
                    correo
                );
            }
            if(IsPhone(fonoContacto) === false){
                throw createValidationError(
                    "Error al Validar el Fono de Contacto: ",
                    fonoContacto
                );
            }
            if(IsBoolean(estado) === false){
                throw createValidationError(
                    "Error al Validar el Estado: ",
                    estado
                );
            }
            const campos = [
                { valor: razonSocial, nombre: "la Razón Social" },
                { valor: giro, nombre: "el Giro" },
                { valor: selectedPais, nombre: "el País" },
                { valor: selectedCiudad, nombre: "la Ciudad" },
                { valor: selectedComuna, nombre: "la Comuna" },
                { valor: direccion, nombre: "la Dirección" },
                { valor: contacto, nombre: "el Contacto" },
                { valor: tipoServicio, nombre: "el Tipo de Servicio" },
                { valor: condicionesPago, nombre: "las Condiciones de Pago" },
                { valor: condicionesEntrega, nombre: "las Condiciones de Entrega" },
                { valor: condicionesDespacho, nombre: "las Condiciones de Despacho" }
            ];

            for (const campo of campos) {
                if (validateField(campo.valor)) {
                    throw createValidationError(
                        `Error al Validar ${campo.nombre}: `,
                        campo.valor
                    );
                }
            }
            const dataSend = {
                rut: rut.replace(".",""),
                razonSocial: razonSocial.toUpperCase(),
                giro: giro.toUpperCase(),
                telefono: telefono,
                correo: correo.toLowerCase(),
                direccion: direccion.toUpperCase(),
                fechaCreacion: fechaCreacion,
                contacto: contacto.toUpperCase(),
                fonoContacto: fonoContacto,
                tipoServicio: tipoServicio,
                estado: estado,
                condicionesPago: condicionesPago.toUpperCase(),
                condicionesEntrega: condicionesEntrega.toUpperCase(),
                condicionesDespacho: condicionesDespacho.toUpperCase(),
                pais: selectedPais,
                ciudad: selectedCiudad,
                comuna: selectedComuna
            };
            await axios.put(
                `${import.meta.env.VITE_API_URL}/proveedor/nuevo`,
                dataSend,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 3000 // timeout de 3 segundos
                }
            );
            setRut("");
            setRazonSocial("");
            setGiro("");
            setTelefono("");
            setCorreo("");
            setDireccion("");
            setSelectedPais("");
            setSelectedCiudad("");
            setSelectedComuna("");
            setFechaCreacion(new Date().toISOString().split("T")[0]);
            setContacto("");
            setFonoContacto("");
            setTipoServicio("");
            setEstado("");
            setCondicionesPago("");
            setCondicionesEntrega("");
            setCondicionesDespacho("");
            // Mostrar notificación de éxito
            toast.success("¡Proveedor guardado exitosamente!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            navigate("/crear_proveedor")
        } catch (error) {
            toast.error("Error al guardar el producto", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            handleErrorWithContext(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
            <ToastContainer aria-label="Notificaciones de la aplicación" />
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
                    Creación de Proveedor
                </h1>
                <form className="w-full">
                    <div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-6 min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-1 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="rut"
                            >
                                RUT
                            </label>
                            <input
                                id="rut"
                                name="rut"
                                type="text"
                                inputMode="numeric"
                                maxLength={12} // 12 por los puntos y guion
                                required
                                value={rut}
                                onChange={e => setRut(formatRut(e.target.value))}
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm"
                            />
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-4 min-[1200px]:col-span-5 min-[1400px]:col-span-6">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="razon"
                            >
                                Razón Social
                            </label>
                            <input
                                id="razon"
                                type="text"
                                name="razonSocial"
                                value={razonSocial}
                                onChange={(e) => setRazonSocial(e.target.value.toUpperCase())}
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm"
                            />
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-3 min-[1400px]:col-span-4">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="giro"
                            >
                                Giro
                            </label>
                            <input
                                id="giro"
                                type="text"
                                name="giro"
                                value={giro}
                                onChange={(e) => setGiro(e.target.value.toUpperCase())}
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
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
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
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value.toLowerCase())}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-2 min-[1200px]:col-span-3 min-[1400px]:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cbo_pais">
                                País
                            </label>
                            <select
                                id="cbo_pais"
                                name="cbo_pais"
                                className="w-full border rounded px-3 py-2"
                                required
                                value={selectedPais}
                                onChange={(e) => setSelectedPais(e.target.value)}
                            >
                                <option value="">Seleccione un país</option>
                                {paises.map((pais) => (
                                    <option key={pais._id} value={pais.iata_code}>
                                        {pais.name_country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cbo_ciudad">
                                Ciudad
                            </label>
                            <select
                                id="cbo_ciudad"
                                name="cbo_ciudad"
                                className="w-full border rounded px-3 py-2"
                                required
                                value={selectedCiudad}
                                onChange={(e) => setSelectedCiudad(e.target.value)}
                            >
                                <option value="">Seleccione una ciudad</option>
                                {ciudades.map((ciudad) => (
                                    <option key={ciudad._id} value={ciudad.iata_codes}>
                                        {ciudad.name_city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cbo_comuna">
                                Comuna
                            </label>
                            <select
                                id="cbo_comuna"
                                name="cbo_comuna"
                                value={selectedComuna}
                                onChange={(e) => setSelectedComuna(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="">Seleccione una comuna</option>
                                {comunas.map((comuna) => (
                                    <option key={comuna._id} value={comuna._id}>
                                        {comuna.name_comuna}
                                    </option>
                                ))}
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
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value.toUpperCase())}
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
                                value={fechaCreacion}
                                onChange={(e) => setFechaCreacion(e.target.value)}
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
                                value={contacto}
                                onChange={(e) => setContacto(e.target.value.toUpperCase())}
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
                                value={fonoContacto}
                                onChange={(e) => setFonoContacto(e.target.value)}
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
                                value={tipoServicio}
                                onChange={(e) => setTipoServicio(e.target.value)}
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
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
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
                                value={condicionesPago}
                                onChange={(e) => setCondicionesPago(e.target.value.toUpperCase())}
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
                                value={condicionesEntrega}
                                onChange={(e) => setCondicionesEntrega(e.target.value.toUpperCase())}
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
                                value={condicionesDespacho}
                                onChange={(e) => setCondicionesDespacho(e.target.value.toUpperCase())}
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
