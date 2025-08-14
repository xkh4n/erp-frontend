# 🔧 Componentes de Seguridad Reutilizables

## Resumen de Componentes Creados

### 📋 **Hooks Reutilizables**

#### 1. **useLoginAttempts**
Hook para manejar intentos de login y bloqueos automáticos.

```typescript
import { useLoginAttempts } from '../../Library/Hooks/useLoginAttempts';

const {
    loginAttempts,
    isBlocked,
    blockTime,
    handleFailedAttempt,
    clearLoginAttempts,
    checkIfBlocked,
    getRemainingTime
} = useLoginAttempts({
    maxAttempts: 3,
    blockDurationMinutes: 15,
    storageKey: 'loginAttempts'
});
```

#### 2. **useSecureForm**
Hook para formularios seguros con protección contra timing attacks.

```typescript
import { useSecureForm } from '../../Library/Hooks/useSecureForm';

const { isLoading, submitForm } = useSecureForm({
    minDelayMs: 1000,
    timeoutMs: 5000
});
```

### 🎨 **Componentes UI Reutilizables**

#### 1. **SecureForm**
Formulario con toda la lógica de seguridad integrada.

```tsx
<SecureForm
    onSubmit={handleFormSubmit}
    config={{
        maxAttempts: 3,
        blockDurationMinutes: 15,
        storageKey: 'loginAttempts'
    }}
>
    {({ isLoading, isBlocked }) => (
        <div>
            {/* Contenido del formulario */}
        </div>
    )}
</SecureForm>
```

#### 2. **ValidatedInput**
Input con validación en tiempo real.

```tsx
<ValidatedInput
    name="email"
    type="email"
    label="Email"
    value={email}
    onChange={setEmail}
    validator={IsEmail}
    errorMessage="Email inválido"
    autoLowercase={true}
    realTimeValidation={true}
    required={true}
/>
```

#### 3. **SecureButton**
Botón con estados de seguridad.

```tsx
<SecureButton
    isLoading={isLoading}
    isBlocked={isBlocked}
    loadingText="Procesando..."
    blockedText="Bloqueado"
    normalText="Enviar"
    icon={submitIcon}
    variant="primary"
/>
```

#### 4. **SecurityIndicator**
Indicador visual de estado de seguridad.

```tsx
<SecurityIndicator
    isBlocked={isBlocked}
    blockTime={blockTime}
    loginAttempts={loginAttempts}
    maxAttempts={3}
    blockDurationMinutes={15}
/>
```

## 📝 **Ejemplos de Uso**

### Ejemplo 1: Formulario de Login Seguro

```tsx
import React, { useState } from 'react';
import { SecureForm } from '../../Components/SecureForm';
import { ValidatedInput } from '../../Components/ValidatedInput';
import { SecureButton } from '../../Components/SecureButton';
import { IsEmail, IsPassword } from '../../Library/Validations';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (formData: FormData) => {
        const email = formData.get('email')?.toString() || '';
        const password = formData.get('password')?.toString() || '';
        
        // Tu lógica de login aquí
        const response = await api.login({ email, password });
        return response;
    };

    return (
        <SecureForm
            onSubmit={handleSubmit}
            config={{ maxAttempts: 3, blockDurationMinutes: 15 }}
        >
            {({ isLoading, isBlocked }) => (
                <>
                    <ValidatedInput
                        name="email"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={setEmail}
                        validator={IsEmail}
                        autoLowercase={true}
                        required={true}
                    />
                    
                    <ValidatedInput
                        name="password"
                        type="password"
                        label="Contraseña"
                        value={password}
                        onChange={setPassword}
                        validator={IsPassword}
                        required={true}
                    />
                    
                    <SecureButton
                        isLoading={isLoading}
                        isBlocked={isBlocked}
                        normalText="Iniciar Sesión"
                        variant="primary"
                    />
                </>
            )}
        </SecureForm>
    );
};
```

### Ejemplo 2: Formulario de Registro

```tsx
export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (data: FormData) => {
        // Lógica de registro
        return await api.register(Object.fromEntries(data));
    };

    return (
        <SecureForm
            onSubmit={handleSubmit}
            config={{ 
                maxAttempts: 5, 
                blockDurationMinutes: 10,
                storageKey: 'registerAttempts'
            }}
        >
            {({ isLoading, isBlocked }) => (
                <>
                    <ValidatedInput
                        name="name"
                        label="Nombre"
                        value={formData.name}
                        onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                        validator={IsName}
                        required={true}
                    />
                    
                    <ValidatedInput
                        name="email"
                        type="email"
                        label="Email"
                        value={formData.email}
                        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                        validator={IsEmail}
                        autoLowercase={true}
                        required={true}
                    />
                    
                    <ValidatedInput
                        name="password"
                        type="password"
                        label="Contraseña"
                        value={formData.password}
                        onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                        validator={IsPassword}
                        required={true}
                    />
                    
                    <SecureButton
                        isLoading={isLoading}
                        isBlocked={isBlocked}
                        normalText="Registrarse"
                        variant="success"
                    />
                </>
            )}
        </SecureForm>
    );
};
```

### Ejemplo 3: Formulario Simple con Hook

```tsx
export const ContactForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    
    const { isLoading, submitForm } = useSecureForm();
    const { isBlocked, handleFailedAttempt } = useLoginAttempts({
        maxAttempts: 5,
        storageKey: 'contactAttempts'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await submitForm(() => api.sendMessage({ email, message }));
            showSuccessToast('Mensaje enviado correctamente');
        } catch (error) {
            handleFailedAttempt();
            showErrorToast('Error al enviar mensaje');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <ValidatedInput
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={setEmail}
                validator={IsEmail}
                required={true}
            />
            
            <ValidatedInput
                name="message"
                label="Mensaje"
                value={message}
                onChange={setMessage}
                minLength={10}
                maxLength={500}
                required={true}
            />
            
            <SecureButton
                isLoading={isLoading}
                isBlocked={isBlocked}
                normalText="Enviar Mensaje"
            />
        </form>
    );
};
```

## 🔧 **Configuración Avanzada**

### Validadores Personalizados

```tsx
<ValidatedInput
    name="rut"
    label="RUT"
    value={rut}
    onChange={setRut}
    customValidators={[
        {
            validator: IsRut,
            message: "RUT inválido"
        },
        {
            validator: (value) => value.length >= 8,
            message: "RUT debe tener al menos 8 caracteres"
        }
    ]}
/>
```

### Configuraciones de Seguridad Personalizadas

```tsx
<SecureForm
    config={{
        maxAttempts: 5,           // Más intentos para formularios menos críticos
        blockDurationMinutes: 30, // Bloqueo más largo
        storageKey: 'customForm', // Key única para este formulario
        minDelayMs: 500,          // Delay más corto
        timeoutMs: 10000,         // Timeout más largo
        showSecurityIndicator: false // Ocultar indicador
    }}
>
    {/* Contenido */}
</SecureForm>
```

## ✅ **Beneficios de la Componentización**

1. **Reutilización**: Misma lógica de seguridad en múltiples formularios
2. **Consistencia**: Comportamiento uniforme en toda la aplicación
3. **Mantenibilidad**: Cambios centralizados afectan todos los formularios
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades de seguridad
5. **Testing**: Componentes aislados más fáciles de testear
6. **Configurabilidad**: Cada formulario puede tener su propia configuración
7. **Separación de responsabilidades**: UI separada de lógica de seguridad

## 🚀 **Próximos Pasos**

1. Crear tests unitarios para cada componente
2. Agregar más tipos de validación (RUT, teléfono, etc.)
3. Implementar persistencia de estado en el servidor
4. Agregar métricas y logging de seguridad
5. Crear componentes para 2FA
6. Implementar progressive enhancement para mejor UX
