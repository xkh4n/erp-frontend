import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IsParagraph } from "../../../../Library/Validations";
import { CustomError, createValidationError } from "../../../../Library/Errores";
import { saveOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ErrorState = {
    code: number;
    message: string;
    detail: string;
};
type country = {
    _id: string;
    iso_code: string;
    iata_code: string;
    name_country: string;
}

type city = {
    _id: string;
    iata_codes: string;
    name_city: string;
}

type estado = {
    _id: string;
    cod_territorial: string;
    cod_postal: string;
    name_comuna: string;
    cod_sii: string;
    ciudad: string; // Assuming this is a reference to a city
}


export default function CrearProveedor() {
    const navigate = useNavigate();

    const [paises, setPaises] = useState<country[]>([]);
    const [ciudades, setCiudades] = useState<city[]>([]);
    const [comunas, setComunas] = useState<estado[]>([]);
    const [selectedPais, setSelectedPais] = useState('');
    const [selectedCiudad, setSelectedCiudad] = useState('');

    const [rut, setRut] = useState("");
    const [digitoVerificador, setDigitoVerificador] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [giro, setGiro] = useState("");

    useEffect(() => {
        const fetchPaises = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/pais/todos`);
                setPaises(response.data.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchPaises();
    }, []);

    useEffect(() => {
        if (!selectedPais) {
            setCiudades([]);
            return;
        }
        const fetchCiudades = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/ciudad/citybycountry`, { country: selectedPais });
                setCiudades(response.data.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchCiudades();
    }, [selectedPais]);

    useEffect(() => {
        if (!selectedCiudad) {
            setComunas([]);
            return;
        }
        const fetchComunas = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/comuna/ciudad`, { ciudad: selectedCiudad });
                setComunas(response.data.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchComunas();
    }, [selectedCiudad]);

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

    const validateField = (fieldValue: string, fieldName: string) => {
        try {
            if (!IsParagraph(fieldValue) || fieldValue === "") {
                throw createValidationError(
                    `Error al Validar ${fieldName}: `,
                    fieldValue
            );
        }
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handlerSubmit = async () => {
        try {
            console.log("Rut:", rut);
        } catch (error) {
            toast.error("Error al guardar el producto", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            handleError(error, navigate);
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
                    <div className="grid grid-cols-1 max-[1000px]:grid-cols-1 min-[1000px]:grid-cols-12 xl:grid-cols-12 gap-4 min-[1000px]:gap-6">
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="rut">RUT</label>
                            <input id="rut" name="rut" type="number" maxLength={8} required value={rut} className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={(e) => setRut(e.target.value)} />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-1 xl:col-span-1">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="digito">Díg. Ver.</label>
                            <input id="digito" type="text" name="digitoVerificador" maxLength={1} value={digitoVerificador} className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" onChange={(e) => setDigitoVerificador(e.target.value)}/>
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-5 xl:col-span-5">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="razon">Razón Social</label>
                            <input id="razon" type="text" name="razonSocial" value={razonSocial} className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required onChange={(e) => setRazonSocial(e.target.value.toUpperCase())} />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-4 xl:col-span-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="giro">Giro</label>
                            <input id="giro" type="text" name="giro" value={giro} className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required  onChange={(e) => setGiro(e.target.value.toUpperCase())}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 max-[1000px]:grid-cols-1 min-[1000px]:grid-cols-12 xl:grid-cols-12 gap-4 min-[1000px]:gap-6">
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="telefono">Teléfono</label>
                            <input id="telefono" type="tel" name="telefono" className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-4 xl:col-span-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Correo</label>
                            <input id="email" type="email" name="correo" className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">País</label>
                            <select
                                id="pais"
                                name="pais"
                                className="w-full border rounded px-3 py-2"
                                required
                                value={selectedPais}
                                onChange={e => setSelectedPais(e.target.value)}
                            >
                                <option value="">Seleccione un país</option>
                                {paises.map((pais) => (
                                    <option key={pais._id} value={pais.iata_code}>{pais.name_country}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Ciudad</label>
                            <select
                                id="ciudad"
                                name="ciudad"
                                className="w-full border rounded px-3 py-2"
                                required
                                value={selectedCiudad}
                                onChange={e => setSelectedCiudad(e.target.value)}
                            >
                                <option value="">Seleccione una ciudad</option>
                                {ciudades.map((ciudad) => (
                                    <option key={ciudad._id} value={ciudad.iata_codes}>{ciudad.name_city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Comuna</label>
                            <select
                                id="comuna"
                                name="comuna"
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="">Seleccione una comuna</option>
                                {comunas.map((comuna) => (
                                    <option key={comuna._id} value={comuna._id}>{comuna.name_comuna}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 max-[1000px]:grid-cols-1 min-[1000px]:grid-cols-12 xl:grid-cols-12 gap-4 min-[1000px]:gap-6">
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-4 xl:col-span-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="direccion">Dirección</label>
                            <input id="direccion" type="text" name="direccion" className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fecha_creacion">Fecha de Creación</label>
                            <input id="fecha_creacion" type="date" name="fechaCreacion" className="w-full border rounded px-3 py-2" value={new Date().toISOString().split('T')[0]} readOnly />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-4 xl:col-span-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="contacto">Contacto</label>
                            <input id="contacto" type="text" name="contacto" className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fono_contacto">Fono Contacto</label>
                            <input id="fono_contacto" type="text" name="fono_contacto" className="w-full border rounded px-3 py-2" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 max-[1000px]:grid-cols-1 min-[1000px]:grid-cols-12 xl:grid-cols-12 gap-4 min-[1000px]:gap-6">
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-2 xl:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tipoServicio">Tipo Servicio</label>
                            <select id="tipoServicio" name="tipoServicio" className="w-full border rounded px-3 py-2" required>
                                <option value=""> </option>
                                <option value="compra">Compras</option>
                                <option value="arriendo">Arriendo</option>
                            </select>
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-1 xl:col-span-1">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="estado">Estado</label>
                            <select id="estado" name="estado" className="w-full border rounded px-3 py-2" required>
                                <option value=""></option>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-3 xl:col-span-3">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="condicionesPago">Condiciones de Pago</label>
                            <input  id="condicionesPago"type="text" name="condicionesPago" className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-3 xl:col-span-3">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="condicionesEntrega">Condiciones de Entrega</label>
                            <input  id="condicionesEntrega"type="text" name="condicionesEntrega" className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div className="w-full max-[1000px]:w-full min-[1000px]:col-span-3 xl:col-span-3">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="condicionesDespacho">Condiciones de Despacho</label>
                            <input  id="condicionesDespacho"type="text" name="condicionesDespacho" className="w-full border rounded px-3 py-2" required />
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
    )
}
