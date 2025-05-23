import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../api/axios";
import "../styles/GestionDeComprobantes.css";
import Caja from '../components/Caja';

// Importa el loader
import { BallTriangle } from 'react-loader-spinner';

const MySwal = withReactContent(Swal);

const GestionDeComprobantes = () => {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true); // <-- estado para loading

  useEffect(() => {
    const fetchComprobantes = async () => {
      try {
        setLoading(true); // activa loader
        const response = await api.get("/comprobantes-pendientes");

        const comprobantesFormateados = response.data.map(c => ({
          ...c,
          imagen: c.imagen
        }));

        setComprobantes(comprobantesFormateados);
      } catch (error) {
        console.error("❌ Error al cargar comprobantes:", error);
      } finally {
        setLoading(false); // desactiva loader cuando termina
      }
    };

    fetchComprobantes();
  }, []);

  const handleVerImagen = (imagenSrc) => {
    MySwal.fire({
      title: "Fotografía del Comprobante",
      html: imagenSrc ? (
        <img
          src={imagenSrc}
          alt="Sin imagen"
          style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "8px" }}
        />
      ) : (
        <div>
          <p style={{ color: "#888" }}>Sin imagen</p>
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      width: "80%",
    });
  };

  const handleEstadoChange = async (index, nuevoEstadoTexto) => {
    const nuevoEstado = nuevoEstadoTexto === "Valido"; 

    const copia = [...comprobantes];
    copia[index].estado = nuevoEstado;
    setComprobantes(copia);

    if (nuevoEstado) {
      try {
        const id = copia[index].id_comprobante;

        const response = await api.patch(`/comprobantes/${id}`, {
          estado: true
        });

        console.log("✅ Estado actualizado en la BD:", response.data);

        Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: "El comprobante, la orden y el formulario fueron marcados como válidos."
        });

      } catch (error) {
        console.error("❌ Error al actualizar estado en la BD:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el estado. Intenta nuevamente."
        });
      }
    }
  };

  const columnas = [
    { name: "ID", selector: row => row.id_comprobante, sortable: true },
    { name: "Código introducido", selector: row => row.codigo, sortable: true },
    {
      name: "Fotografía",
      cell: row => (
        row.imagen ? (
          <img
            src={row.imagen}
            alt="Sin imagen"
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
        ) : (
          <span style={{ fontSize: "12px", color: "#999" }}>Sin imagen</span>
        )
      )
    },
    {
      name: "Estado",
      cell: (row, index) => (
        <select
          value={row.estado ? "Valido" : "Invalido"}
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
      <Caja>
        <div className="contenedor-gestion-comprobantes-div">
          <h2>Gestión de Comprobantes</h2>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
              <BallTriangle
                height={40}
                width={40}
                color="#003366"
                ariaLabel="loading-indicator"
              />
            </div>
          ) : (
            <DataTable
              columns={columnas}
              data={comprobantes}
              pagination
              highlightOnHover
              noDataComponent="No hay comprobantes pendientes."
              responsive
            />
          )}

        </div>
      </Caja>
    </div>
  );
};

export default GestionDeComprobantes;
