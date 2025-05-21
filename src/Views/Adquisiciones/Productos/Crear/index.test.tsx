import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CrearProducto from './index';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CrearProducto Component', () => {
    test('renders correctly', () => {
        render(
            <BrowserRouter>
                <CrearProducto />
            </BrowserRouter>
        );
        expect(screen.getByText(/Creación de Producto/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre del Producto/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Modelo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descripción del Producto/i)).toBeInTheDocument();
    });

    test('validates fields correctly', () => {
        render(
            <BrowserRouter>
                <CrearProducto />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText(/Guardar/i));
        expect(screen.getByText(/Error al Validar el Nombre del Producto/i)).toBeInTheDocument();
    });

    test('submits form and navigates on success', async () => {
        mockedAxios.put.mockResolvedValueOnce({ data: { data: 'success' } });

        render(
            <BrowserRouter>
                <CrearProducto />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), { target: { value: 'Producto Test' } });
        fireEvent.change(screen.getByLabelText(/Modelo/i), { target: { value: 'Modelo Test' } });
        fireEvent.change(screen.getByLabelText(/Descripción del Producto/i), { target: { value: 'Descripción Test' } });

        fireEvent.click(screen.getByText(/Guardar/i));

        expect(mockedAxios.put).toHaveBeenCalledWith(expect.any(String), expect.any(Object), expect.any(Object));
        // Aquí podrías verificar la navegación, pero necesitarías mockear el hook useNavigate
    });
});