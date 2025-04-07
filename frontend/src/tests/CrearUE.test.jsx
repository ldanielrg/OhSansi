import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearUE from '../pages/CrearUE';

describe('CrearUE - Prueba Unitaria', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]), // simulamos que no hay departamentos
      })
    );
  });

  it('debería mostrar alerta si los campos están vacíos', async () => {
    window.alert = jest.fn();

    render(<CrearUE />);

    // Espera que se resuelva el useEffect para evitar el warning
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const boton = screen.getByText('Añadir');
    fireEvent.click(boton);

    expect(window.alert).toHaveBeenCalledWith(
      'Por favor, completa todos los campos antes de continuar.'
    );
  });
});
