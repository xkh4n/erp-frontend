import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente Toast Container
interface ToastProps {
  className?: string;
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
  autoClose?: number | false;
  theme?: "light" | "dark" | "colored";
}

export default function Toast({ 
  className, 
  position = "top-right",
  autoClose = 4000,
  theme = "light"
}: ToastProps) {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
      className={className}
      aria-label="Notificaciones de la aplicación"
    />
  );
}
