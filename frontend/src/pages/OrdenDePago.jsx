import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import Caja from '../components/Caja';
import BotonForm from "../components/BotonForm";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import RegistroForm from '../components/RegistroForm';
import '../styles/OrdenDePago.css';
import Tesseract from 'tesseract.js';
import { BallTriangle } from 'react-loader-spinner';
import { TbNumber } from "react-icons/tb";


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
    const [tamanoImagen, setTamanoImagen] = useState(null);
    const [codigoManual, setCodigoManual] = useState("");
    const [imagenRecibo, setImagenRecibo] = useState(null);



    const columns = [
        { name: "Nombre", selector: (row) => row.nombre, sortable: true },
        { name: "Apellido", selector: (row) => row.apellido, sortable: true },
        { name: "Área", selector: (row) => row.nombre_area },
        { name: "Categoría", selector: (row) => row.nombre_categoria },
        { name: "Precio (Bs)", selector: (row) => row.precio }
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

    const verificarPago = async () => {
        if (!codigoManual || !imagenRecibo) {
            alert("Debes ingresar el código y subir una imagen del recibo.");
            return;
        }

        const imageUrl = URL.createObjectURL(imagenRecibo);

        try {
            const result = await Tesseract.recognize(
            imageUrl,
            "spa",
            {
                logger: (m) => console.log(m),
            }
            );

            const texto = result.data.text;
            console.log("Texto OCR detectado:", texto);

            if (texto.includes(codigoManual)) {
            alert("✅ Código verificado con éxito. ¡Recibo válido!");
            } else {
            alert("❌ El código no coincide con el contenido del recibo.");
            }
        } catch (error) {
            console.error("Error al procesar imagen:", error);
            alert("Hubo un error al leer el recibo.");
        }
    };


    return (
        <div className='orden-pago-container'>
            <Caja titulo='Tomar en cuenta'>
            <div className="contenedor-descargar-archivo">
                <p> <strong>Pasos para completar el pago correctamente:</strong>
                    <br />1.- Descargar la orden de Pago.
                    <br />2.- Llevar la orden de pago y cancelar el monto en Cajas del campus central de la UMSS.
                    <br />3.- Introducir el codigo del recibo.
                    <br />4.- Subir una foto del recibo que no pese mas de 2MB o 2048kb.
                    <br />5.- Esperar el mensaje de confirmacion del Pago
                </p>
            </div>
            </Caja>
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
                            

                        </section>
                    </>
                )}
                </Caja>
                <Caja titulo='Verificacion del pago'>
                    <div className="contenedor-verificar-pago">
                        <div className="contenedor-registro-form-pago">
                        <RegistroForm
                            type="text"
                            label="Ingresa el código de tu recibo"
                            icono={TbNumber}
                            name="codigo"
                            value={codigoManual}
                            onChange={(e) => setCodigoManual(e.target.value)}
                            usarEvento={true}
                        />

                            <p>Sube la foto de tu recibo</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                    const sizeKB = file.size / 1024;
                                    if (sizeKB > 2048) {
                                        alert("La imagen excede el tamaño máximo permitido de 2 MB.");
                                        e.target.value = "";
                                        setTamanoImagen(null);
                                        setImagenRecibo(null);
                                        return;
                                    }
                                    setTamanoImagen(sizeKB.toFixed(2));
                                    setImagenRecibo(file); // guarda imagen para el botón
                                    }
                                }}
                                />
                                {tamanoImagen && (
                                <p style={{ marginTop: '8px' }}>
                                    Tamaño de imagen: <strong>{tamanoImagen} KB</strong>
                                </p>
                                )}
                        </div>
                        <BotonForm texto='Verificar pago' onClick={verificarPago} />
                    </div>
                </Caja>

        </div>
    );
};

export default OrdenDePago;

