import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import Caja from '../components/Caja';
import BotonForm from "../components/BotonForm";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import '../styles/OrdenDePago.css';
import Tesseract from 'tesseract.js';
import { BallTriangle } from 'react-loader-spinner';


const OrdenDePago = () => {
    const { id } = useParams(); // ID del formulario
    const [formulario, setFormulario] = useState(null);
    const [orden, setOrden] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [textoOCR, setTextoOCR] = useState("");
    const [searchParams] = useSearchParams();
    const idConvocatoria = searchParams.get("convocatoria");


    const columns = [
        { name: "Nombre", selector: (row) => row.nombre, sortable: true },
        { name: "Apellido", selector: (row) => row.apellido, sortable: true },
        { name: "Área", selector: (row) => row.nombre_area },
        { name: "Categoría", selector: (row) => row.nombre_categoria },
    ];

    useEffect(() => {
        const cargarDatos = async () => {
            if (parseInt(id) === 0) {
                setCargando(false);
                return;
            }

            try {
                // 1. Datos del formulario con estudiantes
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

                // 2. Datos de la orden de pago
                const ordenRes = await api.get(`/orden-pago/${id}`);
                setOrden(ordenRes.data);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [id]);
    const handleSubirComprobante = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    try {
        const result = await Tesseract.recognize(
            imageUrl,
            'spa', // cambia a 'eng' si el comprobante está en inglés
            {
                logger: (m) => console.log(m),
            }
        );
        setTextoOCR(result.data.text);
        console.log("Texto detectado:", result.data.text);
        alert("Texto OCR detectado:\n" + result.data.text);
    } catch (err) {
        console.error("Error OCR:", err);
        alert("Hubo un error al procesar el comprobante.");
    }
};


    return (
        <div className='orden-pago-container'>
            <Caja titulo='Detalle de orden de pago'>
                {cargando ? (
    <div style={{
        height: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }}>
        <BallTriangle
            height={50}
            width={50}
            color="#003366"
            ariaLabel="ball-triangle-loading"
            visible={true}
        />
    </div>
    ) : (

                    <>
                    <div className="contenedor-fila-1-orden">
                        <p><strong>ID: </strong> {orden?.id_orden}</p>
                        <p><strong>Estado: </strong> {orden?.estado ? 'Pagado' : 'Pendiente'}</p>
                        <p><strong>Formulario: </strong> {formulario?.id_formulario}</p>
                        <p><strong>Fecha de emisión: </strong> {orden?.fecha_emision?.split('T')[0]}</p>
                        <p><strong>Fecha de vencimiento: </strong> {orden?.fecha_vencimiento?.split('T')[0]}</p>
                    </div>

                    <div className="contenedor-fila-1-orden">
                        <p><strong>Nombre del responsable: </strong> {user.name}</p>
                        <p><strong>Unidad educativa: </strong> {orden?.unidad_educativa?.nombre}</p>
                        <p><strong>Monto total: </strong>{orden?.monto_total} Bs</p>
                    </div>


                        <h3>Estudiantes inscritos:</h3>
                        <DataTable
                            columns={columns}
                            data={rowData}
                            pagination
                            noDataComponent="No hay estudiantes registrados."
                            customStyles={{
                                pagination: {
                                    style: { backgroundColor: "white" },
                                    pageButtonsStyle: {
                                        borderRadius: "50%",
                                        margin: "2px",
                                        cursor: "pointer",
                                        color: "#fff",
                                        fill: "#fff",
                                        backgroundColor: "#1A2D5A",
                                        "&:hover": { backgroundColor: "#27467A" },
                                        "&:disabled": {
                                            color: "#888",
                                            backgroundColor: "#ccc",
                                        },
                                    },
                                },
                            }}
                        />
                        <section className="seccion-botones-orden">
                            <BotonForm
                                texto='Volver'
                                onClick={() => navigate(`/inscripciones?convocatoria=${idConvocatoria || ''}`)}
                                className="boton-volver-orden-pago"
                            />
                            <BotonForm
                                texto='Subir comprobante'
                                onClick={() => document.getElementById("comprobanteInput").click()}
                            />

                        </section>
                    </>
                )}
                </Caja>
                <input
                    type="file"
                    accept="image/*"
                    id="comprobanteInput"
                    style={{ display: 'none' }}
                    onChange={handleSubirComprobante}
                />

        </div>
    );
};

export default OrdenDePago;

