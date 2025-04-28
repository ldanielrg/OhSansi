import React, { useState, useEffect } from 'react';
import axios from 'axios'; // <-- Necesitas Axios para las peticiones
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ConfiguracionCuentas.css';
import api from '../api/axios';


const ConfiguracionCuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchCuentas();
  }, []);

  const fetchCuentas = async () => {
    try {
      const response = await api.get('/obtener-cuentas');
      // Ajustamos la estructura si es necesario
      const formattedCuentas = response.data.map(user => ({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.role
      }));

      setCuentas(formattedCuentas);
    } catch (error) {
      console.error('Error al cargar las cuentas:', error);
      toast.error('No se pudieron cargar las cuentas.');
    }
  };

  const promptDeleteCuenta = (cuenta) => {
    setSelectedCuenta(cuenta);
    setShowDeleteModal(true);
  };

  const confirmDeleteCuenta = async () => {
    try {
      await api.delete(`/eliminar-cuenta/${selectedCuenta.id}`);

      const updatedCuentas = cuentas.filter(c => c.id !== selectedCuenta.id);
      setCuentas(updatedCuentas);
      toast.success(`Cuenta "${selectedCuenta.nombre}" eliminada.`);
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      toast.error('No se pudo eliminar la cuenta.');
    }

    setShowDeleteModal(false);
    setSelectedCuenta(null);
  };

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
