// Configuración del menú navbar
export const menuConfig = {
    // Tiempo de delay antes de cerrar el menú (en milisegundos)
    // Aumenta este valor si quieres más tiempo para navegar entre submenús
    closeDelay: 300,
    
    // Cambiar a true si prefieres que los menús solo se abran/cierren con click
    // false = hover + click, true = solo click
    clickOnly: false,
    
    // Tiempo de transición para las animaciones (debe coincidir con las clases CSS)
    transitionDuration: 150,
};

export default menuConfig;
