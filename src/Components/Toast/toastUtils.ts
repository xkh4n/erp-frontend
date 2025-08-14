import { toast } from "react-toastify";

// Tipos de toast disponibles **
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Configuración por defecto para los toasts
const defaultToastConfig = {
  position: "top-right" as const,
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Funciones para mostrar diferentes tipos de toast
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    ...defaultToastConfig,
    autoClose: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...defaultToastConfig,
    autoClose: 5000,
  });
};

export const showWarningToast = (message: string) => {
  toast.warning(message, defaultToastConfig);
};

export const showInfoToast = (message: string) => {
  toast.info(message, defaultToastConfig);
};

// Funciones específicas para aprobación y rechazo
export const showApprovalToast = (itemName?: string) => {
  const message = itemName 
    ? ` ${itemName} ha sido aprobado exitosamente`
    : " Solicitud aprobada exitosamente";
  
  showSuccessToast(message);
};

export const showRejectionToast = (itemName?: string, reason?: string) => {
  const baseMessage = itemName 
    ? ` ${itemName} ha sido rechazado`
    : " Solicitud rechazada";
  
  const fullMessage = reason 
    ? `${baseMessage}. Motivo: ${reason}`
    : baseMessage;
  
  showErrorToast(fullMessage);
};

// Funciones adicionales para casos específicos
export const showPendingToast = (itemName?: string) => {
  const message = itemName 
    ? `⏳ ${itemName} está pendiente de revisión`
    : "⏳ Solicitud en espera de revisión";
  
  showInfoToast(message);
};

export const showProcessingToast = (itemName?: string) => {
  const message = itemName 
    ? `🔄 Procesando ${itemName}...`
    : "🔄 Procesando solicitud...";
  
  showInfoToast(message);
};

export const showCompletedToast = (itemName?: string) => {
  const message = itemName 
    ? `✅ ${itemName} completado exitosamente`
    : "✅ Proceso completado exitosamente";
  
  showSuccessToast(message);
};
