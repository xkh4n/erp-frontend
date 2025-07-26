interface PopupProps {
    message: string;
    isOpen: boolean;
    onClose: () => void;
    type?: 'success' | 'error';
}

export default function Popup({ message, isOpen, onClose, type = 'success' }: PopupProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
                <div className={`text-center ${type === 'success' ? 'text-green-600' : 'text-red-600'} text-xl mb-4`}>
                    {type === 'success' ? '✓' : '✕'}
                </div>
                <p className="text-center text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
}