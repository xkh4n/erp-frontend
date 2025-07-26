interface InputProps {
    name: string;
    placeholder: string;
    type: string;
    label: string;
    value: string;
    error?: boolean;
    errorMessage?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TextBox({ 
    name, 
    placeholder, 
    type, 
    label, 
    value, 
    error, 
    errorMessage,
    onChange 
}: InputProps) {
    return (
        <div className=" min-w-full">
            <label className="text-gray-700 text-sm" htmlFor={name}>{label}</label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                className={`mb-1 px-4 py-2 min-w-full rounded-xl border ${error ? 'border-red-500' : 'border-gray-300'} shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500`}
                value={value}
                onChange={onChange}
            />
            {error && errorMessage && (
                <span className="text-red-500 text-xs mb-2 block">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}