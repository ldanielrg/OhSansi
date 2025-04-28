import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ConfiguracionCuentas.css';

const ConfiguracionCuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cargar cuentas del localStorage al iniciar
  useEffect(() => {
    const storedCuentas = JSON.parse(localStorage.getItem('cuentas')) || [
      { id: 1, nombre: 'Juan Pérez', rol: 'Administrador' },
      { id: 2, nombre: 'María López', rol: 'Director' },
      { id: 3, nombre: 'Carlos Gómez', rol: 'Docente' },
      { id: 4, nombre: 'Ana Fernández', rol: 'Docente' },
    ];
    setCuentas(storedCuentas);
  }, []);

  // Guardar cambios en localStorage
  const updateLocalStorage = (updatedCuentas) => {
    localStorage.setItem('cuentas', JSON.stringify(updatedCuentas));
  };

  // Prompt para eliminar cuenta
  const promptDeleteCuenta = (cuenta) => {
    setSelectedCuenta(cuenta);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const confirmDeleteCuenta = () => {
    const updatedCuentas = cuentas.filter(c => c.id !== selectedCuenta.id);
    setCuentas(updatedCuentas);
    updateLocalStorage(updatedCuentas);
    toast.error(`Cuenta "${selectedCuenta.nombre}" eliminada.`);
    setShowDeleteModal(false);
    setSelectedCuenta(null);
  };

  // Cancelar eliminación
  const cancelDeleteCuenta = () => {
    setShowDeleteModal(false);
    setSelectedCuenta(null);
    toast.info('Eliminación cancelada.');
  };

  return (
    <div className="container configuracion-cuentas my-4">
      <h2 className="cuentas-title mb-4">Configuración de Cuentas</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-head">
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th className="text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map(cuenta => (
              <tr key={cuenta.id}>
                <td>{cuenta.nombre}</td>
                <td>{cuenta.rol}</td>
                <td className="text-center">
                  <button
                    className="btn btn-eliminar"
                    onClick={() => promptDeleteCuenta(cuenta)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="modal-container">
          <div className="modal-content">
            <p>¿Deseas eliminar la cuenta "{selectedCuenta?.nombre}"?</p>
            <div style={{ marginTop: "1rem" }}>
              <button
                className="btn-primary"
                onClick={confirmDeleteCuenta}
                style={{ marginRight: "1rem" }}
              >
                Eliminar
              </button>
              <button className="btn-primary" onClick={cancelDeleteCuenta}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ConfiguracionCuentas;
