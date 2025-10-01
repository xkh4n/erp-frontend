import React from 'react';
import { IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, playBackOutline, playForwardOutline } from 'ionicons/icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    total,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    loading = false
}) => {
    // Calcular el rango de elementos mostrados
    const startItem = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, total);

    // Generar array de páginas a mostrar (máximo 7 páginas visibles)
    const getVisiblePages = () => {
        const delta = 2; // Páginas a mostrar a cada lado de la página actual
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); 
             i <= Math.min(totalPages - 1, currentPage + delta); 
             i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
    };

    const visiblePages = totalPages > 1 ? getVisiblePages() : [];

    if (total === 0) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
            {/* Información de registros */}
            <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                <span className="text-sm text-gray-700">
                    Mostrando {startItem} - {endItem} de {total} registros
                </span>
                
                {/* Selector de elementos por página */}
                <div className="flex items-center space-x-2 ml-4">
                    <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
                        Por página:
                    </label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
                <div className="flex items-center space-x-1">
                    {/* Primera página */}
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1 || loading}
                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        title="Primera página"
                    >
                        <IonIcon icon={playBackOutline} className="w-4 h-4" />
                    </button>

                    {/* Página anterior */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        title="Página anterior"
                    >
                        <IonIcon icon={chevronBackOutline} className="w-4 h-4" />
                    </button>

                    {/* Números de página */}
                    {visiblePages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
                            disabled={loading || page === '...'}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                page === currentPage
                                    ? 'bg-blue-950 text-white'
                                    : page === '...'
                                    ? 'bg-white text-gray-400 cursor-default'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                            } disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Página siguiente */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        title="Página siguiente"
                    >
                        <IonIcon icon={chevronForwardOutline} className="w-4 h-4" />
                    </button>

                    {/* Última página */}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages || loading}
                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        title="Última página"
                    >
                        <IonIcon icon={playForwardOutline} className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pagination;