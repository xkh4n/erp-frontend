import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { EstadisticaCategoria } from '../../Library/Hooks/Models';

interface InventarioChartProps {
    data: EstadisticaCategoria[];
    tipo?: 'bar' | 'pie';
}

// Paleta de colores más variada y atractiva para el gráfico
const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE',
    '#AED6F1', '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB'
];

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: EstadisticaCategoria;
    }>;
}

const InventarioChart: React.FC<InventarioChartProps> = ({ 
    data, 
    tipo = 'bar' 
}) => {
    const CustomTooltip = ({ active, payload }: TooltipProps) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{`${data.categoria}`}</p>
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
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            innerRadius={30}
                            fill="#8884d8"
                            dataKey="cantidad"
                            nameKey="categoria"
                            stroke="#fff"
                            strokeWidth={2}
                        >
                            {data.map((_, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
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
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="categoria" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        fontSize={12}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="cantidad" 
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                    >
                        {data.map((_, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default InventarioChart;