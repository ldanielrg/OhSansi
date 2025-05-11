import "../styles/Formulario.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Caja from "../components/Caja";
import BotonForm from "../components/BotonForm";
import DataTable from "react-data-table-component";
import RegistroForm from "../components/RegistroForm";
import api from "../api/axios";
import * as XLSX from "xlsx";
import { FaRegUser } from "react-icons/fa";
import { MdEmail, MdOutlineDateRange } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa6";
import { PiStudentFill } from "react-icons/pi";
import { BallTriangle } from 'react-loader-spinner';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// SweetAlert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const Formulario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    ci: "",
    fechaNac: "",
    rude: "",
    area: "",
    categoria: "",
    ue: "",
    municipio: "",
    unidadEducativa: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleClearSelected, setToggleClearSelected] = useState(false);
  const selectedRowsRef = useRef([]);
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [ue, setUe] = useState([]);
  const [searchParams] = useSearchParams();
  const [idConvocatoria, setIdConvocatoria] = useState(null);


  const columns = [
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Apellido", selector: (row) => row.apellido, sortable: true },
    { name: "CI", selector: (row) => row.ci },
    { name: "Fecha de Nacimiento", selector: (row) => row.fechaNac },
    { name: "Rude", selector: (row) => row.rude },
    { name: "Área", selector: (row) => row.nombre_area },
    { name: "Categoría", selector: (row) => row.nombre_categoria },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#E1F4FF",
        color: "black",
        fontWeight: "semibold",
        fontSize: "14px",
      },
    },
  };
useEffect(() => {
  const cargarAreas = async () => {
    if (!idConvocatoria) return;
    try {
      const res = await api.get(`/areas/${idConvocatoria}`);
      setAreas(res.data);
    } catch (error) {
      console.error("Error al obtener áreas:", error);
      toast.error("Error al obtener las áreas.");
    }
  };

  cargarAreas();
}, [idConvocatoria]);




  useEffect(() => {
    fetch("http://localhost:8000/api/areas")
      .then((res) => res.json())
      .then((data) => setAreas(data));
    fetch("http://localhost:8000/api/municipios")
      .then((res) => res.json())
      .then((data) => setMunicipios(data));
    fetch("http://localhost:8000/api/unidades-educativas")
      .then((res) => res.json())
      .then((data) => setUe(data));
  }, []);
  useEffect(() => {
  const cargarCategorias = async () => {
    if (!formData.area || isNaN(parseInt(formData.area))) {
      setCategorias([]);
      return;
    }

    try {
      const res = await api.get(`/categorias/${formData.area}`);
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      toast.error("Error al obtener las categorías.");
    }
  };

  cargarCategorias();
}, [formData.area]);


  useEffect(() => {
  const cargarFormulario = async () => {
    if (parseInt(id) === 0) {
      setCargando(false);
      return;
    }

    try {
      const response = await api.get(`/formulario-detalles/${id}`);
      const estudiantes = response.data.estudiantes;

      // 👇 guardar convocatoria
      setIdConvocatoria(response.data.id_convocatoria_convocatoria);

      const estudiantesFormateados = estudiantes.map((est) => ({
        id_estudiante: est.id_estudiante ?? null,
        nombre: est.nombre,
        apellido: est.apellido,
        email: est.email,
        ci: est.ci,
        fechaNac: est.fecha_nacimiento,
        rude: est.rude,
        id_area: est.idAarea,
        nombre_area: est?.nombre_area || "",
        id_categoria: est.idCategoria,
        nombre_categoria: est?.nombre_categoria || "",
        municipio: "",
        unidadEducativa: "",
      }));
      setRowData(estudiantesFormateados);
    } catch (error) {
      console.error("Error al cargar formulario:", error);
      toast.error("No se pudo cargar el formulario.");
    } finally {
      setCargando(false);
    }
  };

  cargarFormulario();
}, [id]);

  

  const opcionesFiltradasUE = ue
    .filter((item) => item.municipio_id === parseInt(formData.municipio))
    .map((item) => ({ value: item.id_ue, label: item.nombre_ue }));

  const handleRegistrar = () => {
    const { nombre, apellido, ci, fechaNac, rude, area, categoria } = formData;
    if (nombre.length < 6)
      return toast.warn("El nombre debe tener al menos 6 caracteres.");
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre))
      return toast.warn("El nombre solo puede contener letras y espacios.");
    if (!/\d{1,16}/.test(rude))
      return toast.warn("El RUDE debe contener solo números (máx. 16 dígitos).");
    if (!/\d{1,8}/.test(ci))
      return toast.warn("El CI debe contener solo números (máx. 8 dígitos).");

    const areaSeleccionada = areas.find((a) => a.id_area === parseInt(area));
    const categoriaSeleccionada = categorias.find(
      (c) => c.id_categoria === parseInt(categoria)
    );

    const nuevoEstudiante = {
      ...formData,
      id_area: areaSeleccionada ? areaSeleccionada.id_area : null,
      nombre_area: areaSeleccionada ? areaSeleccionada.nombre_area : "",
      id_categoria: categoriaSeleccionada
        ? categoriaSeleccionada.id_categoria
        : null,
      nombre_categoria: categoriaSeleccionada
        ? categoriaSeleccionada.nombre_categoria
        : "",
    };

    if (modoEdicion && editIndex !== null) {
      const nuevosDatos = [...rowData];
      nuevosDatos[editIndex] = nuevoEstudiante;
      setRowData(nuevosDatos);
      setModoEdicion(false);
      setEditIndex(null);
    } else {
      setRowData((prev) => [...prev, nuevoEstudiante]);
    }

    toast.success("Estudiante registrado correctamente.");
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      ci: "",
      fechaNac: "",
      rude: "",
      area: "",
      categoria: "",
      ue: "",
      municipio: "",
      unidadEducativa: "",
    });
    setSelectedRows([]);
    selectedRowsRef.current = [];
    setToggleClearSelected((prev) => !prev);
  };

  const handleEditar = async () => {
    const seleccionActual = selectedRowsRef.current;
    if (seleccionActual.length === 0)
      return toast.warn("Por favor selecciona un registro para editar.");
    if (seleccionActual.length > 1)
      return toast.warn("Solo puedes editar un registro a la vez.");

    const result = await MySwal.fire({
      title: '¿Editar registro?',
      text: "¿Deseas editar este registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    const seleccionado = seleccionActual[0];
    const index = rowData.findIndex((est) => est.ci === seleccionado.ci);
    if (index === -1) {
      toast.error("No se pudo encontrar el registro a editar.");
      return;
    }

    setFormData({ ...seleccionado });
    setEditIndex(index);
    setModoEdicion(true);
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      setSelectedRows([]);
      selectedRowsRef.current = [];

      const workbook = XLSX.read(data, { type: "array" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const rows = jsonData.slice(13);
      if (rows.length === 0)
        return toast.error("El archivo no contiene datos válidos.");

      const nuevosEstudiantes = [];
      for (let i = 0; i < rows.length; i++) {
        const fila = rows[i];
        const [
          ,
          nombre,
          apellido,
          ci,
          rude,
          fechaNacOriginal,
          area,
          categoria,
          email,
        ] = fila;

        let fechaNac = fechaNacOriginal;
        if (typeof fechaNac === "number") {
          const excelStartDate = new Date(1900, 0, 1);
          excelStartDate.setDate(excelStartDate.getDate() + fechaNac - 2);
          fechaNac = excelStartDate.toISOString().split("T")[0];
        }

        if (
          !nombre || !apellido || !ci || !fechaNac || !rude || !area || !categoria
        ) {
          return toast.error(`Error en fila ${i + 14}: Algún campo vacío.`);
        }

        nuevosEstudiantes.push({
          nombre,
          apellido,
          ci: ci.toString(),
          fechaNac,
          rude: rude.toString(),
          nombre_area: area,
          nombre_categoria: categoria,
          email: email || "",
        });
      }

      if (nuevosEstudiantes.length > 0) {
        setRowData((prev) => [...prev, ...nuevosEstudiantes]);
        toast.success(`¡Se agregaron ${nuevosEstudiantes.length} estudiantes correctamente!`);
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = "";
  };

  const handleEliminar = async () => {
    const seleccionActual = selectedRowsRef.current;
    if (seleccionActual.length === 0)
      return toast.warn("Por favor selecciona un registro para eliminar.");

    const result = await MySwal.fire({
      title: '¿Eliminar registros?',
      text: "¿Deseas eliminar el/los registros seleccionados?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    const nuevosDatos = rowData.filter(
      (row) => !seleccionActual.some((sel) => sel.ci === row.ci)
    );
    setRowData(nuevosDatos);
    setSelectedRows([]);
    selectedRowsRef.current = [];
    setToggleClearSelected((prev) => !prev);

    toast.success('Registros eliminados correctamente.');
  };

  const handleGuardarFormulario = async () => {
    if (rowData.length === 0) {
      toast.warn("No hay estudiantes registrados para guardar.");
      return;
    }

    const datosEnviar = {
      id_formulario_actual: parseInt(id),
      estudiantes: rowData.map((est) => ({
        id_estudiante: est.id_estudiante ?? null,
        nombre: est.nombre,
        apellido: est.apellido,
        email: est.email,
        ci: parseInt(est.ci),
        fecha_nacimiento: est.fechaNac,
        rude: parseInt(est.rude),
        idAarea: est.id_area,
        idCategoria: est.id_categoria,
      })),
    };

    try {
      console.log(datosEnviar);
      const response = await api.post("/inscribir", datosEnviar);
      console.log("Formulario guardado exitosamente:", response.data);
      toast.success("Formulario guardado exitosamente.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Ocurrió un error al guardar el formulario.");
    }
  };

  const fileInputRef = useRef();
  const [cargando, setCargando] = useState(true);


  return (
    <>
  <ToastContainer
    position="bottom-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    draggable
    theme="light"
  />

  {cargando ? (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
      backgroundColor: "#f8f9fa"
    }}>
      <BallTriangle
        height={50}
        width={50}
        radius={5}
        color="#003366"
        ariaLabel="ball-triangle-loading"
        visible={true}
      />
    </div>
  ) : (
    
    <div className="formulario-page-container">
      <Caja titulo="Tomar en cuenta">
        <div>
          En caso de querer inscribir un grupo de estudiantes sin usar el
          formulario, puede hacerlo descargando el siguiente archivo excel
          siguiendo las instrucciones:
        </div>
        <div className="contenedor-archivo-excel">
          <a
            href="/public/plantillas/FormatoParaSubirLista.xlsx"
            download="FormatoParaSubirLista.xlsx"
            className="boton-descargar-excel"
          >
            Descargar plantilla Excel
          </a>
        </div>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        <div>
          Paso 1.- Descargar el archivo. <br />
          Paso 2.- Llenar los campos correspondientes en el excel. <br />
          Paso 3.-Subir el archivo a esta pagina presionando el boton "Subir
          lista". <br />
          En caso de no cumplir el formato sugerido explicado en el documento
          excel, el sistema rechazará su archivo.
        </div>
      </Caja>
      <section className="contenedor-form-info">
        <div className="boton-eliminar-form">
          <BotonForm texto="X" className="boton-eliminar-form-bf" />
        </div>

        <Caja
          titulo={`Formulario de Inscripción #${id}`}
          width="99%"
          className="caja-formulario-est"
        >
          <div className="contenedor-secciones-form">
            <section className="seccion-form">
              <RegistroForm
                label="Nombres"
                name="nombre"
                value={formData.nombre}
                onChange={setFormData}
                icono={FaRegUser}
              />
              <RegistroForm
                label="C.I."
                name="ci"
                value={formData.ci}
                onChange={setFormData}
                icono={FaAddressCard}
              />
              <RegistroForm
                label="Fecha de nacimiento"
                name="fechaNac"
                type="date"
                value={formData.fechaNac}
                onChange={setFormData}
                icono={MdOutlineDateRange}
              />
              <RegistroForm
                label="Categoria"
                name="categoria"
                type="select"
                value={formData.categoria}
                onChange={setFormData}
                options={[
                  { value: "", label: "Seleccione una Categoria" },
                  ...categorias.map((cat) => ({
                    value: cat.id_categoria,
                    label: cat.nombre_categoria,
                  })),
                ]}
              />
              <RegistroForm
                label="Municipio"
                name="municipio"
                type="select"
                value={formData.municipio}
                onChange={setFormData}
                options={[
                  { value: "", label: "Seleccione un Municipio" },
                  ...municipios.map((mun) => ({
                    value: mun.id,
                    label: mun.nombre,
                  })),
                ]}
              />
              <BotonForm
                className="boton-lista-est"
                texto="Subir lista"
                onClick={() => fileInputRef.current.click()}
              />
            </section>

            <section className="seccion-form">
              <RegistroForm
                label="Apellidos"
                name="apellido"
                value={formData.apellido}
                onChange={setFormData}
                icono={FaRegUser}
              />
              <RegistroForm
                label="Rude"
                name="rude"
                value={formData.rude}
                onChange={setFormData}
                icono={PiStudentFill}
              />
              <RegistroForm
                label="Área"
                name="area"
                type="select"
                value={formData.area}
                onChange={setFormData}
                options={[
                  { value: "", label: "Seleccione una Área" },
                  ...areas.map((area) => ({
                    value: area.id_area,
                    label: area.nombre_area,
                  })),
                ]}
              />
              <RegistroForm
                label="Unidad Educativa"
                name="unidadEducativa"
                type="select"
                value={formData.unidadEducativa}
                onChange={setFormData}
                options={[
                  { value: "", label: "Seleccione una Unidad Educativa" },
                  ...opcionesFiltradasUE,
                ]}
              />
              <RegistroForm
                label="Email"
                name="email"
                value={formData.email}
                onChange={setFormData}
                icono={MdEmail}
              />
              <div className="contenedor-boton-registrar-est">
                <BotonForm
                  texto={modoEdicion ? "Guardar" : "Registrar"}
                  onClick={handleRegistrar}
                />
              </div>
            </section>
          </div>
        </Caja>

        <Caja titulo="Estudiantes inscritos" width="99%">
          <DataTable
            columns={columns}
            data={rowData}
            selectableRows
            selectableRowsNoSelectAll
            clearSelectedRows={toggleClearSelected}
            onSelectedRowsChange={({ selectedRows }) => {
              setSelectedRows(selectedRows);
              selectedRowsRef.current = selectedRows;
            }}
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
            noDataComponent="Aquí verás a los estudiantes que inscribiste."
            pagination
            responsive
          />
          <div className="contenedor-botones-tabla-est-inscritos">
            <BotonForm
              className="botones-editar-eliminar-tabla-est"
              texto="Editar"
              onClick={handleEditar}
            />
            <BotonForm
              className="botones-editar-eliminar-tabla-est"
              texto="Eliminar"
              onClick={handleEliminar}
            />
          </div>
        </Caja>

        <div className="div-boton-guardar-form-est">
          <BotonForm
            className="boton-guardar-form-est"
            texto="Guardar formulario"
            onClick={handleGuardarFormulario}
          />
        </div>
      </section>
    </div>
  )}
  </>
  );
};

export default Formulario;