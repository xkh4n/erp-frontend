import { saveOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Toast, showApprovalToast, showErrorToast } from '../../../../Components/Toast';

import { handleError } from "../../../../Library/Utils/errorHandler";
import axios from "axios";
/*
showApprovalToast, showRejectionToast, showErrorToast, showInfoToast, showPendingToast, showProcessingToast
*/

/* TYPES */

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


type Proveedor = {
    _id: string;
    razonSocial: string;
}

type Producto = {
    _id: string;
    nombre: string;
    descripcion: string;
}
/* END TYPES */

/* COMPONENT */
export default function AgregarProducto() {
    const navigate = useNavigate();
    const location = useLocation();

    // Función helper para manejo de errores con contexto fijo
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);


    const [selectedGerencia, setSelectedGerencia] = useState("");
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [selectedProveedor, setSelectedProveedor] = useState("");
    const [selectedProducto, setSelectedProducto] = useState("");
    
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [serie, setSerie] = useState("");
    const [valor, setValor] = useState("");
    const [documentoTipo, setDocumentoTipo] = useState("");
    const [documentoNumero, setDocumentoNumero] = useState("");

    const [gerencias, setGerencias] = useState<Gerencia[]>([]);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);


/* USEEFFECTS */
// Cargar las Gerencias al montar el componente
useEffect(() => {
    const fetchGerencias = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/gerencia/todas`
            );
            setGerencias(response.data.data);
        } catch (error) {
            handleErrorWithContext(error);
        }
    };
    fetchGerencias();
},[handleErrorWithContext]);

// Cargar las Categorías al montar el componente
useEffect(() => {
    const fetchCategorias = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/categoria/todos`
            );
            setCategorias(response.data.data);
        } catch (error) {
            handleErrorWithContext(error);
        }
    };
    fetchCategorias();
},[handleErrorWithContext]);

useEffect(() => {
    const fetchProveedores = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/proveedor/todos`
            );
            setProveedores(response.data.data);
        } catch (error) {
            handleErrorWithContext(error);
        }
    };
    fetchProveedores();
}, [handleErrorWithContext]);

useEffect(() => {
    const fetchProductos = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/producto/todos`
            );
            setProductos(response.data.data);
        } catch (error) {
            handleErrorWithContext(error);
        }
    };
    fetchProductos();
}, [handleErrorWithContext]);
/* END USEEFFECTS */

/* Handler Submit */
    const handlerSubmit = async () => {
        if (!selectedGerencia || !selectedCategoria || !marca || !modelo || !serie || !documentoTipo || !documentoNumero || !valor || !descripcion) {
            showErrorToast("Todos los campos son obligatorios.");
            return;
        }
        try {

            showApprovalToast("Producto agregado exitosamente.");
        } catch (error) {
            handleErrorWithContext(error);
        }
    };
/* END Handler Submit */

/* Render */
    return (
        <div className="flex flex-col items-center justify-center h-max bg-gray-200 p-4 md:p-5 lg:p-6">
            <Toast autoClose={3000} theme="dark" className="custom-toast"/>
            <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">Agregar Producto</h1>
            </div>
            <form className="w-full">
                <div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-8 min-[1000px]:grid-cols-9 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-2 min-[1400px]:col-span-3">
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
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-2 min-[1400px]:col-span-3">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="categoria"
                        >
                            Categoría
                        </label>
                        <select
                            id="categoria"
                            name="categoria"
                            className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                            required
                            value={selectedCategoria}
                            onChange={(e) => setSelectedCategoria(e.target.value)}
                        >
                            <option value="">Seleccione su Categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria._id} value={categoria._id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-2 min-[1400px]:col-span-3">
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
                            <option value="">Seleccione su Proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor._id} value={proveedor._id}>
                                    {proveedor.razonSocial}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-2 min-[1400px]:col-span-3">
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
                            <option value="">Seleccione su Producto</option>
                            {productos.map((producto) => (
                                <option key={producto._id} value={producto._id}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="txtmarca"
                        >
                            Marca
                        </label>
                        <input
                            id="txtmarca"
                            name="txtmarca"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value.toUpperCase())}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                            placeholder="Ingrese la Marca del Producto"
                        />
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="txtmodelo"
                        >
                            Modelo
                        </label>
                        <input
                            id="txtmodelo"
                            name="txtmodelo"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value.toUpperCase())}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                            placeholder="Ingrese el Modelo del Producto"
                        />
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-3 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="txtserie"
                        >
                            Serie
                        </label>
                        <input
                            id="txtserie"
                            name="txtserie"
                            value={serie}
                            onChange={(e) => setSerie(e.target.value.toUpperCase())}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                            placeholder="Ingrese la Serie del Producto"
                        />
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="tipo_documento"
                        >
                            Tipo Documento
                        </label>
                        <select
                            id="tipo_documento"
                            name="tipo_documento"
                            className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                            required
                            value={documentoTipo}
                            onChange={(e) => setDocumentoTipo(e.target.value)}
                        >
                            <option value="">Seleccione su Tipo de Documento</option>
                            <option value="GDV">GUIA DE DESPACHO</option>
                            <option value="FCV">FACTURA</option>
                            <option value="BLV">BOLETA</option>
                            <option value="NCV">NOTA DE CREDITO</option>
                            <option value="OTR">ORDEN DE TRANSPORTE</option>
                        </select>
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="numero_documento"
                        >
                            Número Documento
                        </label>
                        <input
                            id="numero_documento"
                            name="numero_documento"
                            value={documentoNumero}
                            onChange={(e) => setDocumentoNumero(e.target.value.toUpperCase())}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                            placeholder="Ingrese el Número del Documento"
                        />
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="txt_valor"
                        >
                            Valor
                        </label>
                        <input
                            id="txt_valor"
                            name="txt_valor"
                            value={valor}
                            onChange={(e) => setValor(e.target.value.toUpperCase())}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                            placeholder="Ingrese el Valor"
                        />
                    </div>
                    <div className="w-full max-[799px]:w-full min-[800px]:col-span-8 min-[1000px]:col-span-8 min-[1200px]:col-span-10 min-[1400px]:col-span-12">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="txt_descripcion"
                        >
                            Descripción
                        </label>
                        <input
                            id="txt_descripcion"
                            name="txt_descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm"
                            placeholder="Ingrese la Descripción"
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={handlerSubmit}
                        className="flex justify-center items-center bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-white focus:outline-none focus:ring py-2 w-60 rounded-full shadow-xl hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1"
                    >
                        <IonIcon icon={saveOutline} className="w-5 h-5" />
                        <p className="ml-1 text-lg">Guardar</p>
                    </button>
                </div>
            </form>
        </div>
    )
}
