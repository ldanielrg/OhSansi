import React, { useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../styles/GestionDeComprobantes.css";
import imagenPrueba from "../assets/imagenPrueba.jpeg"; // Imagen de prueba local

const MySwal = withReactContent(Swal);

const GestionDeComprobantes = () => {
  const [comprobantes, setComprobantes] = useState([
    {
      id_comprobante: 1,
      codigo: "ABC123",
      id_orden_pago: 101,
      imagen: imagenPrueba,
      estado: "Invalido"
    },
    {
      id_comprobante: 2,
      codigo: "DEF456",
      id_orden_pago: 102,
      imagen: imagenPrueba,
      estado: "Invalido"
    },
    {
      id_comprobante: 3,
      codigo: "GHI789",
      id_orden_pago: 103,
      imagen: imagenPrueba,
      estado: "Invalido"
    }
  ]);

  const handleVerImagen = (imagenSrc) => {
    MySwal.fire({
      title: "Fotografía del Comprobante",
      html: (
        <img
          src={imagenSrc}
          alt="comprobante"
          style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "8px" }}
        />
      ),
      showCloseButton: true,
      showConfirmButton: false,
      width: "80%",
    });
  };

  const handleEstadoChange = (index, nuevoEstado) => {
    const copia = [...comprobantes];
    copia[index].estado = nuevoEstado;
    setComprobantes(copia);
  };

  const columnas = [
    { name: "ID", selector: row => row.id_comprobante, sortable: true },
    { name: "Código", selector: row => row.codigo, sortable: true },
    {
      name: "Fotografía",
      cell: row => (
        <img
          src={row.imagen}
          alt="miniatura"
          onClick={() => handleVerImagen(row.imagen)}
          style={{
            width: 60,
            height: 60,
            objectFit: "cover",
            cursor: "pointer",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
      )
    },
    {
      name: "Estado",
      cell: (row, index) => (
        <select
          value={row.estado}
          onChange={(e) => handleEstadoChange(index, e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        >
          <option value="Invalido">Inválido</option>
          <option value="Valido">Válido</option>
        </select>
      )
    }
  ];

  return (
    <div className="contenedor-gestion-comprobantes">
      <h2>Gestión de Comprobantes (Datos Estáticos)</h2>
      <DataTable
        columns={columnas}
        data={comprobantes}
        pagination
        highlightOnHover
        noDataComponent="No hay comprobantes."
      />
    </div>
  );
};

export default GestionDeComprobantes;
