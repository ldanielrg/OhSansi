import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import Caja from '../components/Caja';
import BotonForm from "../components/BotonForm";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import '../styles/OrdenDePago.css';

const OrdenDePago = () => {
    const { id } = useParams();
    const [formulario, setFormulario] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const columns = [
        { name: "Nombre", selector: (row) => row.nombre, sortable: true },
        { name: "Apellido", selector: (row) => row.apellido, sortable: true },
        { name: "Área", selector: (row) => row.nombre_area },
        { name: "Categoría", selector: (row) => row.nombre_categoria },
    ];

    useEffect(() => {
        const cargarFormulario = async () => {
            if (parseInt(id) === 0) {
                setCargando(false);
                return;
            }
    
            try {
                const response = await api.get(`/formulario-detalles/${id}`);
                const data = response.data;
                setFormulario(data);
    
                const estudiantes = data.estudiantes || [];
                const estudiantesFormateados = estudiantes.map((est) => ({
                    nombre: est.nombre,
                    apellido: est.apellido,
                    nombre_area: est?.nombre_area || "",
                    nombre_categoria: est?.nombre_categoria || "",
                }));
    
                setRowData(estudiantesFormateados);
            } catch (error) {
                console.error("Error al cargar formulario:", error);
            } finally {
                setCargando(false);
            }
        };
    
        cargarFormulario();
    }, [id]);
    

    return (
        <div className='orden-pago-container'>
            <Caja titulo='Detalle de orden de pago'>
                {cargando ? (
                    <p>Cargando datos...</p>
                ) : (
                    <>
                        <p><strong>ID:</strong></p>
                        <p><strong>Estado:</strong> {formulario?.estado}</p>
                        <p><strong>Formulario: #</strong></p>
                        <p><strong>Fecha de emisión:</strong> {formulario?.fecha_emision}</p>
                        <p><strong>Fecha de vencimiento:</strong> {formulario?.fecha_vencimiento}</p>
                        <p><strong>Nombre del responsable:</strong> {user.name}</p>
                        <p><strong>Unidad educativa:</strong> {formulario?.unidad_educativa?.nombre}</p>

                        <h3>Estudiantes inscritos:</h3>
                        <DataTable
                            columns={columns}
                            data={rowData}
                            pagination
                            noDataComponent="No hay estudiantes registrados."
                            customStyles={{
                                pagination: {
                                style: {
                                    backgroundColor: "white"
                                },
                                pageButtonsStyle: {
                                    borderRadius: "50%",
                                    margin: "2px",
                                    cursor: "pointer",
                                    color: "#fff",
                                    fill: "#fff",
                                    backgroundColor: "#1A2D5A", // azul marino
                                    "&:hover": {
                                    backgroundColor: "#27467A", // más claro al pasar el mouse
                                    },
                                    "&:disabled": {
                                    color: "#888",
                                    backgroundColor: "#ccc",
                                    },
                                },
                                },
                            }}
                        />
                        <section>
                        <BotonForm 
  texto='Volver' 
  onClick={() => navigate('/inscripciones')}
/>

                        </section>
                    </>
                )}
            </Caja>
        </div>
    );
};

export default OrdenDePago;
