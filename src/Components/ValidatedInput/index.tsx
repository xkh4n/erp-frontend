import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { TextBox } from '../Input';

interface ValidatedInputProps {
    name: string;
    type?: string;
    placeholder?: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    validator?: (value: string) => boolean;
    errorMessage?: string;
    className?: string;
    required?: boolean;
    autoLowercase?: boolean;
    realTimeValidation?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidators?: Array<{
        validator: (value: string) => boolean;
        message: string;
    }>;
}

export interface ValidatedInputRef {
    validate: () => boolean;
}

/**
 * Componente de input reutilizable con validación en tiempo real
 * Integra múltiples validadores y transformaciones de texto
 */
export const ValidatedInput = forwardRef<ValidatedInputRef, ValidatedInputProps>(({
    name,
    type = "text",
    placeholder = "",
    label,
    value,
    onChange,
    validator,
    errorMessage = "Este campo contiene errores",
    required = false,
    autoLowercase = false,
    realTimeValidation = true,
    minLength,
    maxLength,
    pattern,
    customValidators = []
}, ref) => {
    const [error, setError] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    const validateValue = useCallback((inputValue: string): { isValid: boolean; message: string } => {
        // Si está vacío y no es requerido, es válido
        if (!inputValue && !required) {
            return { isValid: true, message: '' };
        }

        // Si está vacío y es requerido, es inválido
        if (!inputValue && required) {
            return { isValid: false, message: 'Este campo es requerido' };
        }

        // Validar longitud mínima
        if (minLength && inputValue.length < minLength) {
            return { isValid: false, message: `Debe tener al menos ${minLength} caracteres` };
        }

        // Validar longitud máxima
        if (maxLength && inputValue.length > maxLength) {
            return { isValid: false, message: `No debe exceder ${maxLength} caracteres` };
        }

        // Validar patrón regex
        if (pattern && !pattern.test(inputValue)) {
            return { isValid: false, message: errorMessage };
        }

        // Ejecutar validador principal
        if (validator && !validator(inputValue)) {
            return { isValid: false, message: errorMessage };
        }

        // Ejecutar validadores personalizados
        for (const customValidator of customValidators) {
            if (!customValidator.validator(inputValue)) {
                return { isValid: false, message: customValidator.message };
            }
        }

        return { isValid: true, message: '' };
    }, [validator, errorMessage, required, minLength, maxLength, pattern, customValidators]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        // Aplicar transformación a minúsculas si está habilitada
        if (autoLowercase) {
            inputValue = inputValue.toLowerCase();
        }

        // Validar en tiempo real si está habilitado
        if (realTimeValidation && inputValue.length > 0) {
            const validation = validateValue(inputValue);
            setError(!validation.isValid);
            setValidationMessage(validation.message);
        } else {
            setError(false);
            setValidationMessage('');
        }

        onChange(inputValue);
    }, [autoLowercase, realTimeValidation, validateValue, onChange]);

    // Función para validar externamente (puede ser llamada por el formulario padre)
    const validate = useCallback((): boolean => {
        const validation = validateValue(value);
        setError(!validation.isValid);
        setValidationMessage(validation.message);
        return validation.isValid;
    }, [value, validateValue]);

    // Exponer la función de validación para uso externo
    useImperativeHandle(ref, () => ({
        validate
    }), [validate]);

    return (
        <TextBox
            name={name}
            type={type}
            placeholder={placeholder}
            label={label}
            value={value}
            error={error}
            errorMessage={validationMessage || errorMessage}
            onChange={handleChange}
        />
    );
});

// Agregar displayName para debugging
ValidatedInput.displayName = 'ValidatedInput';

export default ValidatedInput;
