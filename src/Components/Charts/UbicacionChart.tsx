import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { EstadisticaUbicacion } from '../../Library/Hooks/Models/useInventarioEstadisticasUbicacion';

interface UbicacionChartProps {
    data: EstadisticaUbicacion[];
    tipo?: 'bar' | 'pie';
}

// Paleta de colores para ubicaciones (diferentes a la de categorías)
const COLORS_UBICACION = [
    '#FF9800', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF5722',
    '#795548', '#9E9E9E', '#607D8B', '#F44336', '#E91E63'
];

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: EstadisticaUbicacion;
    }>;
}

// Tipo compatible con Recharts
type ChartDataType = {
    [key: string]: string | number;
};

const UbicacionChart: React.FC<UbicacionChartProps> = ({ 
    data, 
    tipo = 'bar' 
}) => {
    const CustomTooltip = ({ active, payload }: TooltipProps) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{`${data.ubicacion}`}</p>
                    <p className="text-blue-600">{`Cantidad: ${data.cantidad}`}</p>
                    <p className="text-green-600">{`Valor: $${data.valorTotal.toLocaleString()}`}</p>
                </div>
            );
        }
        return null;
    };

    if (tipo === 'pie') {
        return (
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data as unknown as ChartDataType[]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            innerRadius={30}
                            fill="#8884d8"
                            dataKey="cantidad"
                            nameKey="ubicacion"
                            stroke="#fff"
                            strokeWidth={2}
                        >
                            {data.map((_, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS_UBICACION[index % COLORS_UBICACION.length]} 
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data as unknown as ChartDataType[]}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="ubicacion" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        fontSize={12}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="cantidad" 
                        fill="#FF9800"
                        radius={[4, 4, 0, 0]}
                    >
                        {data.map((_, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS_UBICACION[index % COLORS_UBICACION.length]} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UbicacionChart;