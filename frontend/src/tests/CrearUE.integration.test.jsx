import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearUE from '../pages/CrearUE';

describe('CrearUE - Prueba de Integración', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('departamentos')) {
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 1, nombre: 'La Paz' }]),
        });
      } else if (url.includes('municipios')) {
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 10, nombre: 'El Alto' }]),
        });
      } else if (url.includes('unidad-educativa')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Unidad Educativa creada' }),
        });
      }
    });

    window.alert = jest.fn();
  });

  it('debería enviar el formulario con datos válidos', async () => {
    render(<CrearUE />);

    await waitFor(() => screen.getByLabelText('Nombre de Unidad Educativa'));

    fireEvent.change(screen.getByLabelText('Nombre de Unidad Educativa'), {
      target: { value: 'UE Prueba', name: 'nombre' },
    });
    fireEvent.change(screen.getByLabelText('RUE'), {
      target: { value: '123456', name: 'rue' },
    });

    // Simular selección de departamento y municipio (esto dependerá de cómo uses react-select, puedes mockearlo mejor en pruebas e2e)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('departamentos'));
    });

    fireEvent.click(screen.getByText('Añadir'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('✅ UNIDAD EDUCATIVA CREADA CON EXITO.');
    });
  });
});
