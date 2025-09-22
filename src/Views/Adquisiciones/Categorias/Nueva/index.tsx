import { saveOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useState, useEffect, useCallback } from "react";
import { IsParagraph } from "../../../../Library/Validations";
import { handleError } from "../../../../Library/Utils/errorHandler";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast, showApprovalToast, showErrorToast } from '../../../../Components/Toast';



type Categoria = {
	_id: string;
	codigo: string;
	nombre: string;
	descripcion: string;
};

export default function CrearCategoria() {
	const navigate = useNavigate();
	const location = useLocation();

	// Función helper para manejo de errores con contexto fijo
	const handleErrorWithContext = useCallback((error: unknown) => {
		handleError(error, navigate, location.pathname);
	}, [navigate, location.pathname]);

	const [selectedCategoria, setSelectedCategoria] = useState("");
	const [tipoCategoria, setTipoCategoria] = useState("");
	const [nombreCategoria, setNombreCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
	const [categorias, setCategorias] = useState<Categoria[]>([]);

    const fetchCategorias = useCallback(async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/categoria/todos`
            );
            
            // Manejar respuesta exitosa, incluso con array vacío
            if (response.data.codigo === 200) {
                setCategorias(response.data.data.sort((a: Categoria, b: Categoria) => a.nombre.localeCompare(b.nombre)) || []);
                if (response.data.data?.length === 0) {
                    console.log('No hay categorías disponibles. Se puede crear la primera categoría.');
                }
            } else {
                setCategorias([]);
                console.warn('Respuesta inesperada del servidor:', response.data);
            }
        } catch (error) {
            // Solo manejar errores reales del servidor, no cuando no hay datos
            console.error('Error al obtener categorías:', error);
            setCategorias([]); // Establecer array vacío para permitir crear la primera categoría
            // No llamar handleErrorWithContext aquí para evitar redirecciones innecesarias
        }
    }, []);

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

	const getLastCategoria = async () => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/categoria/last`
			);
			
			// Verificar si hay datos válidos en la respuesta
			if (!response.data || !response.data.data || !response.data.data.codigo) {
				// Si no hay categorías, empezar con CAT001
				console.log('No hay categorías previas, iniciando con CAT001');
				return "CAT001";
			}
			
			// Verificar el formato del código y extraer la parte numérica
			const codigoCompleto = response.data.data.codigo;
			console.log('Último código encontrado:', codigoCompleto);
			let codigoNumerico = "";
			
			if (codigoCompleto.startsWith("CAT")) {
				// Si el formato es CAT004, extraer solo el número
				codigoNumerico = codigoCompleto.substring(3); // "004"
			} else {
				// Si tiene otro formato, usar toda la cadena
				codigoNumerico = codigoCompleto;
			}
			
			console.log('Código numérico extraído:', codigoNumerico);
			
			// Convertir a entero, sumar 1, y formatear con ceros a la izquierda
			const numeroActual = parseInt(codigoNumerico, 10);
			
			// Verificar si el número es válido
			if (isNaN(numeroActual)) {
				// Si no se puede convertir a número, empezar con CAT001
				console.log('Número inválido, usando CAT001 por defecto');
				return "CAT001";
			}
			
			const numeroSiguiente = numeroActual + 1;
			const codigoNuevo = `CAT${numeroSiguiente.toString().padStart(3, '0')}`;
			
			console.log('Nuevo código generado:', codigoNuevo);
			return codigoNuevo; // Retornar el nuevo código completo
		} catch (error) {
			// Si hay error en el request, empezar con CAT001
			console.warn("Error al obtener la última categoría, usando código por defecto:", error);
			return "CAT001";
		}
	}

	const clearFields = () => {
		console.log('Limpiando campos...');
		console.log('Valor anterior de selectedCategoria:', selectedCategoria);
		setSelectedCategoria("");
		setTipoCategoria("");
		setNombreCategoria("");
		setDescripcion("");
		console.log('Campos limpiados - selectedCategoria debería estar vacío');
		// No limpiar las categorías aquí para mantener el select poblado
	}


	const handlerSubmit = async () => {
		try {
			console.log('=== INICIO handlerSubmit ===');
			console.log('selectedCategoria:', selectedCategoria);
			console.log('nombreCategoria:', nombreCategoria);
			console.log('tipoCategoria:', tipoCategoria);
			console.log('descripcion:', descripcion);
			
			if(!IsParagraph(nombreCategoria) || nombreCategoria === "") {
				showErrorToast(`Error al Validar el Nombre de la Categoría: ${nombreCategoria}`);
				return;
			}
			if(!IsParagraph(descripcion) || descripcion === "") {
				showErrorToast(`Error al Validar la Descripción de la Categoría: ${descripcion}`);
				return;
			}
			if (selectedCategoria === "") {
				showErrorToast(`Debe seleccionar una categoría: ${selectedCategoria}`);
				return;
			}
			if( tipoCategoria === "") {
				showErrorToast(`Debe seleccionar un tipo de categoría: ${tipoCategoria}`);
				return;
			}
			
			// Determinar el código según la selección
			let codigoObtenido = "";
			
			console.log('Valor seleccionado en el combo:', selectedCategoria);
			
			if (selectedCategoria === "new") {
				// Si es nueva categoría, obtener el próximo código disponible
				console.log('Creando nueva categoría, obteniendo próximo código...');
				codigoObtenido = await getLastCategoria();
				console.log('Código generado para nueva categoría:', codigoObtenido);
			} else {
				// Si es categoría existente, usar el código seleccionado
				console.log('Usando categoría existente con código:', selectedCategoria);
				codigoObtenido = selectedCategoria;
			}
			
			// Validar que el código obtenido no esté vacío
			if (!codigoObtenido || codigoObtenido === "") {
				showErrorToast(`Error al generar el código de la categoría: ${codigoObtenido}`);
				return;
			}
			
			console.log('Código final a enviar:', codigoObtenido);
			
			const datosEnviar = [
				{
					"codigo": codigoObtenido,
					"nombre": nombreCategoria,
					"descripcion": descripcion,
					"tipo": tipoCategoria,
					"estado":true
				}
			];
			await axios.put(
					`${import.meta.env.VITE_API_URL}/categoria/nuevo`,
					datosEnviar,
					{
						headers: {
							"Content-Type": "application/json"
						},
						timeout: 3000 // timeout de 3 segundos
					}
				);
			clearFields();
			// Recargar las categorías después de guardar exitosamente
			await fetchCategorias();
			showApprovalToast("Categoría");
			navigate("/crear_categoria"); // Redirige a la página de productos después de guardar el producto
		} catch (error) {
			showErrorToast("Error al guardar la Categoría");
			handleErrorWithContext(error);
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-200 p-4 md:p-5 lg:p-6">
			<Toast autoClose={3000} theme="dark" className="custom-toast"/>
			<div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
                    Nueva Categoría
                </h1>
				<form className="w-full">
					<div className="grid grid-cols-1 max-[799px]:grid-cols-1 min-[800px]:grid-cols-6 min-[1000px]:grid-cols-8 min-[1200px]:grid-cols-10 min-[1400px]:grid-cols-12 gap-4">
                        <div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="cbo_categoria"
                            >
                                Categorías
                            </label>
                            <select
                                id="cbo_categoria"
                                name="cbo_categoria"
                                className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                                value={selectedCategoria}
                                onChange={(e) => setSelectedCategoria(e.target.value)}
                            >
                                <option value="">Seleccione su Categoría</option>
								<option value="new">Nueva Categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria._id} value={categoria.codigo}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
						<div className="w-full max-[799px]:w-full min-[800px]:col-span-3 min-[1000px]:col-span-2 min-[1200px]:col-span-2 min-[1400px]:col-span-2">
							<label
								className="block text-gray-700 text-sm font-medium mb-2"
								htmlFor="tipo_categoria"
							>
								Tipo Categoría
							</label>
							<select
								id="tipo_categoria"
								name="tipo_categoria"
								className="w-full px-3 py-2 md:px-4 md:py
								2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								required
								value={tipoCategoria}
								onChange={(e) => setTipoCategoria(e.target.value)}
							>
								<option value="">Seleccione el Tipo de Categoría</option>
								<option value="arriendo">Arriendos</option>
								<option value="compras">Compras</option>
								<option value="proyectos">Proyectos</option>
							</select>
						</div>
						<div className="w-full max-[799px]:w-full min-[800px]:col-span-2 min-[1000px]:col-span-4 min-[1200px]:col-span-6 min-[1400px]:col-span-3">
							<label
								className="block text-gray-700 text-sm font-medium mb-2"
								htmlFor="nombre_categoria"
							>
								Nombre Categoría
							</label>
							<input
								id="nombre_categoria"
								name="nombre_categoria"
								type="text"
								className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								value={nombreCategoria}
								onChange={(e) => setNombreCategoria(e.target.value.toUpperCase())}								
							/>
						</div>
						<div className="w-full max-[799px]:w-full min-[800px]:col-span-4 min-[1000px]:col-span-8 min-[1200px]:col-span-10 min-[1400px]:col-span-5">
							<label
								className="block text-gray-700 text-sm font-medium mb-2"
								htmlFor="catDescripcion"
							>
								Descripción
							</label>
							<input
								id="catDescripcion"
								name="catDescripcion"
								type="text"
								value={descripcion}
								className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-300 shadow-sm text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
							/>
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
	);
}
