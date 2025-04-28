// ConfiguracionCuentas.jsx
import React from "react";
import "../styles/ConfiguracionCuentas.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconBasurero from "../assets/basura.png";

const ConfiguracionCuentas = () => {
  const cuentas = [
    { id: 1, nombre: "Juan Pérez", rol: "Administrador" },
    { id: 2, nombre: "Maria López", rol: "Director" },
    { id: 3, nombre: "Carlos Gómez", rol: "Docente" },
    { id: 4, nombre: "Ana Fernández", rol: "Docente" },
  ];

  const eliminarCuenta = (nombre) => {
    toast.error(`Cuenta eliminada: ${nombre}`, {
      position: "bottom-right",
      autoClose: 2000,
    });
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
            {cuentas.map((cuenta) => (
              <tr key={cuenta.id}>
                <td>{cuenta.nombre}</td>
                <td>{cuenta.rol}</td>
                <td className="text-center">
                  <button
                    className="btn btn-eliminar"
                    onClick={() => eliminarCuenta(cuenta.nombre)}
                  >
                
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contenedor de alertas abajo a la derecha */}
      <ToastContainer />
    </div>
  );
};

export default ConfiguracionCuentas;
