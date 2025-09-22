import { useState } from 'react';
import InventarioChart from '../../Components/Charts/InventarioChart';
import UbicacionChart from '../../Components/Charts/UbicacionChart';
import { useInventarioEstadisticas } from '../../Library/Hooks/Models';
import { useInventarioEstadisticasUbicacion } from '../../Library/Hooks/Models/useInventarioEstadisticasUbicacion';
import { IonIcon } from '@ionic/react';
import { 
    cubeOutline, 
    trendingUpOutline, 
    cashOutline, 
    reloadOutline,
    barChartOutline,
    pieChartOutline 
} from 'ionicons/icons';

export default function Dashboard() {
    const { estadisticas, loading, error, refetch } = useInventarioEstadisticas();
    const { data: estadisticasUbicacion, loading: loadingUbicacion, error: errorUbicacion, refetch: refetchUbicacion } = useInventarioEstadisticasUbicacion();
    const [tipoGrafico, setTipoGrafico] = useState<'bar' | 'pie'>('pie'); // Cambiado a 'pie' por defecto
    const [tipoGraficoUbicacion, setTipoGraficoUbicacion] = useState<'bar' | 'pie'>('pie');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={refetch}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        <IonIcon icon={reloadOutline} className="mr-2" />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!estadisticas) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">No hay datos disponibles</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Inventario</h1>
                <p className="text-gray-600">Resumen y estadísticas del inventario actual</p>
            </div>

            {/* Cards de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <IonIcon icon={cubeOutline} className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {estadisticas.resumen.totalItems.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <IonIcon icon={cashOutline} className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                ${estadisticas.resumen.valorTotal.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                            <IonIcon icon={trendingUpOutline} className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Categorías</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {estadisticas.porCategoria.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de gráficos */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                {/* Gráfico de Categorías */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Inventario por Categoría</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setTipoGrafico('bar')}
                                className={`p-2 rounded-lg ${
                                    tipoGrafico === 'bar' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <IonIcon icon={barChartOutline} />
                            </button>
                            <button
                                onClick={() => setTipoGrafico('pie')}
                                className={`p-2 rounded-lg ${
                                    tipoGrafico === 'pie' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <IonIcon icon={pieChartOutline} />
                            </button>
                            <button
                                onClick={refetch}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                            >
                                <IonIcon icon={reloadOutline} />
                            </button>
                        </div>
                    </div>
                    
                    <InventarioChart 
                        data={estadisticas.porCategoria}
                        tipo={tipoGrafico}
                    />
                    
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Haz click en cualquier categoría para ver el inventario filtrado
                    </p>
                </div>

                {/* Gráfico de Ubicaciones */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Inventario por Ubicación</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setTipoGraficoUbicacion('bar')}
                                className={`p-2 rounded-lg ${
                                    tipoGraficoUbicacion === 'bar' 
                                        ? 'bg-orange-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <IonIcon icon={barChartOutline} />
                            </button>
                            <button
                                onClick={() => setTipoGraficoUbicacion('pie')}
                                className={`p-2 rounded-lg ${
                                    tipoGraficoUbicacion === 'pie' 
                                        ? 'bg-orange-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <IonIcon icon={pieChartOutline} />
                            </button>
                            <button
                                onClick={refetchUbicacion}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                            >
                                <IonIcon icon={reloadOutline} />
                            </button>
                        </div>
                    </div>
                    
                    {loadingUbicacion ? (
                        <div className="h-80 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        </div>
                    ) : errorUbicacion ? (
                        <div className="h-80 flex items-center justify-center">
                            <p className="text-red-600">{errorUbicacion}</p>
                        </div>
                    ) : estadisticasUbicacion?.porUbicacion.length ? (
                        <UbicacionChart 
                            data={estadisticasUbicacion.porUbicacion}
                            tipo={tipoGraficoUbicacion}
                        />
                    ) : (
                        <div className="h-80 flex items-center justify-center">
                            <p className="text-gray-500">No hay datos de ubicación disponibles</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid de estadísticas adicionales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Estados */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Por Estado</h3>
                    <div className="space-y-3">
                        {estadisticas.porEstado.map((estado) => (
                            <div key={estado._id} className="flex justify-between items-center">
                                <span className="text-gray-700">{estado.estado}</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                    {estado.cantidad}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Centros de Costo */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Centros de Costo</h3>
                    <div className="space-y-3">
                        {estadisticasUbicacion?.porCentroCosto.slice(0, 5).map((centro) => (
                            <div key={centro.codigo} className="flex justify-between items-center">
                                <span className="text-gray-700">
                                    {centro.ubicacion || 'Sin centro de costo'}
                                </span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                    {centro.cantidad}
                                </span>
                            </div>
                        )) || (
                            <div className="space-y-3">
                                {Array.from({length: 3}).map((_, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                                        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-8"></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
