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
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


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
    const pdfRef = useRef();



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
                    precio: est?.precio || 0
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

    try {
        // Paso 1: Verificar si ya fue validado anteriormente
        const check = await api.get(`/verificar-codigo/${codigoManual}`);
        if (check.data.verificado) {
            alert("⚠️ Este comprobante ya fue verificado anteriormente.");
            return;
        }

        // Paso 2: Ejecutar OCR
        const imageUrl = URL.createObjectURL(imagenRecibo);
        const result = await Tesseract.recognize(imageUrl, "spa", {
            logger: (m) => console.log(m),
        });

        const texto = result.data.text;
        console.log("Texto OCR detectado:", texto);

        // Paso 3: Preparar datos para guardar comprobante
        const formData = new FormData();
        formData.append("codigo", codigoManual);
        formData.append("imagen", imagenRecibo);
        formData.append("id_orden_pago", orden.id_orden);
        formData.append("codigo_ocr", texto);

        // Paso 4: Enviar al backend
        await api.post("/guardar-comprobante", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // Paso 5: Mostrar resultado
        if (texto.includes(codigoManual)) {
            alert("✅ Código verificado con éxito. ¡Recibo válido!");
        } else {
            alert("❌ El código no coincide con el contenido del recibo.");
        }

        // Paso 6: Limpiar los campos del formulario
        setCodigoManual("");
        setImagenRecibo(null);
        setTamanoImagen(null);
        document.querySelector("input[type='file']").value = "";

    } catch (err) {
        console.error("Error al verificar o guardar comprobante:", err);

        if (err.response?.status === 422) {
            const errores = err.response.data.errors;
            const mensaje = Object.values(errores).flat().join("\n");
            alert(`❌ Error de validación:\n${mensaje}`);
        } else {
            alert("❌ Error al procesar el comprobante.");
        }
    }
};



    const handleDescargarPDF = async () => {
    // Crea un contenedor temporal en el DOM
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "800px";
    container.style.padding = "40px";
    container.style.background = "white";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "black";

    // Genera el HTML con los datos
    container.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
            <div style="display: flex; align-items: center; justify-content: flex-start;margin-bottom: 20px;">
                <div style="display:flex; flex-direction: row; justify-content: center; align-items:center">
                    <img src="/images/logoUMSS.png" style="height: 80px; padding:0; margin:0" alt="Logo UMSS" />
                    <div style="margin-right:20px; margin-left: 20px; padding: 0px 0px 0px 0px">
                        <h2 style="margin: 0;text-align: center; color: #000; font-weight: 300; font-size: 25px">UNIVERSIDAD MAYOR DE SAN SIMÓN</h2>
                        <h3 style="margin: 0;text-align: center; font-size: 20px">OLIMPIADAS “OH SANSI”</h3>
                    </div>
                    <img src="/images/logoOHSANSI.png" style="height: 80px; padding:0; margin:0" alt="Logo UMSS" />
                </div>
            </div>

        <h4 style="text-align: start; padding-top: 15px; font-size: 20px"> <strong>DETALLE DE ORDEN DE PAGO:</strong> </h4>

        <p><strong>Código:</strong> ${orden.id_orden}</p>
        <p><strong>Nombre del responsable:</strong> ${user.name}</p>
        <p><strong>CI:</strong> ${user.ci || "---"}</p>
        <p><strong>Unidad Educativa:</strong> ${orden.unidad_educativa?.nombre}</p>
        <p><strong>Fecha de emisión:</strong> ${orden.fecha_emision}</p>
        <p><strong>Fecha de vencimiento:</strong> ${orden.fecha_vencimiento}</p>
        <p><strong>Estudiantes inscritos:</strong> ${rowData.length}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="border: 1px solid black; padding: 6px;">Nombre</th>
          <th style="border: 1px solid black; padding: 6px;">Apellido</th>
          <th style="border: 1px solid black; padding: 6px;">Área</th>
          <th style="border: 1px solid black; padding: 6px;">Categoría</th>
          <th style="border: 1px solid black; padding: 6px;">Precio (Bs)</th>
        </tr>
      </thead>
      <tbody>
        ${rowData.map(est => `
          <tr>
            <td style="border: 1px solid black; padding: 6px;">${est.nombre}</td>
            <td style="border: 1px solid black; padding: 6px;">${est.apellido}</td>
            <td style="border: 1px solid black; padding: 6px;">${est.nombre_area}</td>
            <td style="border: 1px solid black; padding: 6px;">${est.nombre_categoria}</td>
            <td style="border: 1px solid black; padding: 6px;">${est.precio}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div style="display: flex; justify-content: end">
        <p><strong>Monto total:</strong> ${orden.monto_total} Bs</p>
    </div>

        <p style="margin-top: 60px; text-align: center;">____________________<br />Responsable de delegación</p>
    `;

    document.body.appendChild(container);

    // Captura el contenido con html2canvas
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;
    let page = 1;
    const totalPages = Math.ceil(imgHeight / pdfHeight);

    while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

        // Pie de página
        pdf.setFontSize(9);
        pdf.text(
        "Av. Oquendo Prolongación Jordán, Cajas, Planta Baja, Tel.: 4666631",
        pdfWidth / 2,
        pdfHeight - 15,
        { align: "center" }
        );
        pdf.text(
        "E-mail: drei@umss.edu.bo — web: http://www.drei.umss.edu.bo — Cochabamba - Bolivia",
        pdfWidth / 2,
        pdfHeight - 10,
        { align: "center" }
        );
        pdf.text(`Página ${page} de ${totalPages}`, pdfWidth - 20, pdfHeight - 5);

        heightLeft -= pdfHeight;
        position -= pdfHeight;

        if (heightLeft > 0) {
        pdf.addPage();
        page++;
        }
    }

    pdf.save(`orden_pago_${formulario.id_formulario}.pdf`);
    document.body.removeChild(container); // Limpia el DOM
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
                <BotonForm texto="Descargar PDF" onClick={handleDescargarPDF} className="btn-descargar-pdf" />

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
                        <p><strong>Fecha de emisión: </strong> {orden?.fecha_emision?.split('T')[0]}</p>
                        <p><strong>Fecha de vencimiento: </strong> {orden?.fecha_vencimiento?.split('T')[0]}</p>

                        <p><strong>Formulario: </strong> {formulario?.id_formulario}</p>
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
                <BotonForm
                                texto='Volver'
                                onClick={() => navigate(`/inscripciones?convocatoria=${idConvocatoria || ''}`)}
                                className="boton-volver-orden-pago"
                            />
        </div>
    );
};

export default OrdenDePago;

