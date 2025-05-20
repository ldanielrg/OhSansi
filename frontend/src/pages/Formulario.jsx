import "../styles/Formulario.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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

const [numParticipantes, setNumParticipantes] = useState(1);
const [formIndexActivo, setFormIndexActivo] = useState(0);
const [formulariosEquipo, setFormulariosEquipo] = useState([
  { nombre: "", apellido: "", ci: "", fechaNac: "", rude: "", area: "", categoria: "", email: "" }
]);
const [contadorEquipos, setContadorEquipos] = useState(1); // para generar id_equipo incremental
const [idEquipoEnEdicion, setIdEquipoEnEdicion] = useState(null);



  


const columns = [
  { name: "Nombre", selector: (row) => row.nombre, sortable: true },
  { name: "Apellido", selector: (row) => row.apellido, sortable: true },
  { name: "CI", selector: (row) => row.ci },
  { name: "Fecha de Nacimiento", selector: (row) => row.fechaNac },
  { name: "Rude", selector: (row) => row.rude },
  { name: "Área", selector: (row) => row.nombre_area },
  { name: "Categoría", selector: (row) => row.nombre_categoria },
  { name: "Id equipo", selector: (row) => row.id_equipo },
  { name: "Tipo de equipo", selector: (row) => row.tipo_equipo }
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
  const areaActual = formulariosEquipo[formIndexActivo]?.area;

  if (!areaActual || isNaN(parseInt(areaActual))) {
    setCategorias([]);
    return;
  }

  const cargarCategorias = async () => {
    try {
      const res = await api.get(`/categorias/${areaActual}`);
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      toast.error("Error al obtener las categorías.");
    }
  };

  cargarCategorias();
}, [formIndexActivo, formulariosEquipo[formIndexActivo]?.area]);



  useEffect(() => {
  const formularioId = parseInt(id);
  if (isNaN(formularioId)) {
    toast.error("ID de formulario inválido.");
    return;
  }

  if (formularioId === 0) {
    const convocatoriaFromURL = searchParams.get("convocatoria");
    if (convocatoriaFromURL) {
      setIdConvocatoria(parseInt(convocatoriaFromURL));
    } else {
      toast.error("No se encontró la convocatoria para el nuevo formulario.");
    }
    setCargando(false);
    return;
  }

  const cargarFormulario = async () => {
    try {
      const response = await api.get(`/formulario-detalles/${id}`);
      const estudiantes = response.data.estudiantes;

      if (response.data.id_convocatoria_convocatoria) {
        setIdConvocatoria(response.data.id_convocatoria_convocatoria);
      } else {
        toast.error("Error: la convocatoria no fue encontrada.");
      }

      const estudiantesFormateados = estudiantes.map((est) => ({
  id_estudiante: est.id_estudiante ?? null,
  nombre: est.nombre,
  apellido: est.apellido,
  email: est.email,
  ci: est.ci,
  fechaNac: est.fecha_nacimiento,
  rude: est.rude,
  id_area: est.idAarea ?? null,
  nombre_area: est?.nombre_area || "",
  id_categoria: est.idCategoria ?? null,
  nombre_categoria: est?.nombre_categoria || "",
  id_equipo: est.team ?? null,
  tipo_equipo: est.tipo_equipo ?? null,
  municipio: "",
  unidadEducativa: ""
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



useEffect(() => {
  const area = formulariosEquipo[formIndexActivo]?.area;
  const categoria = formulariosEquipo[formIndexActivo]?.categoria;

  if (!area || !categoria) return;

  const obtenerCantidadParticipantes = async () => {
    try {
      const res = await api.get(`/participantes`, {
        params: {
          id_area: area,
          id_categoria: categoria
        }
      });
      console.log("Respuesta de participantes:", res.data);

      const cantidad = parseInt(res.data?.cantidad || 1);

      setNumParticipantes(cantidad);
      setFormIndexActivo(0);
      setFormulariosEquipo(
        Array.from({ length: cantidad }, () => ({
          nombre: "", apellido: "", ci: "", fechaNac: "", rude: "", area, categoria, email: ""
        }))
      );
    } catch (error) {
      console.error("Error al obtener cantidad de participantes:", error);
      toast.error("No se pudo obtener la cantidad de integrantes para esta categoría.");
    }
  };

  obtenerCantidadParticipantes();
}, [formulariosEquipo[formIndexActivo]?.categoria]);




  

  const opcionesFiltradasUE = ue
    .filter((item) => item.municipio_id === parseInt(formData.municipio))
    .map((item) => ({ value: item.id_ue, label: item.nombre_ue }));



const handleRegistrar = async () => {
  // Validar todos los estudiantes del equipo
  for (let i = 0; i < formulariosEquipo.length; i++) {
    const estudiante = formulariosEquipo[i];
    const { nombre, apellido, ci, fechaNac, rude, area, categoria } = estudiante;

    if (nombre.length < 2)
      return toast.warn(`Nombre inválido en integrante ${i + 1}`);
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre))
      return toast.warn(`Nombre con caracteres inválidos en integrante ${i + 1}`);
    if (!/\d{1,16}/.test(rude))
      return toast.warn(`RUDE inválido en integrante ${i + 1}`);
    if (!/\d{1,8}/.test(ci))
      return toast.warn(`CI inválido en integrante ${i + 1}`);
    const fechaNacimiento = new Date(fechaNac);
    const hoy = new Date();

    if (!fechaNac || isNaN(fechaNacimiento)) {
      return toast.warn(`Fecha de nacimiento inválida en integrante ${i + 1}`);
    }

    if (fechaNacimiento > hoy) {
      return toast.warn(`La fecha de nacimiento no puede ser en el futuro (integrante ${i + 1})`);
    }

  }

  let idEquipo = contadorEquipos;

  // Si NO estamos en modo edición, obtenemos el número de equipo desde la API
  if (!modoEdicion) {
    try {
      const area = formulariosEquipo[0].area;
      const categoria = formulariosEquipo[0].categoria;

      const res = await api.get('/dame-mi-team', {
        params: {
          id_area: area,
          id_categoria: categoria
        }
      });

      idEquipo = res.data.siguiente_team;
    } catch (error) {
      console.error("Error al obtener el número de equipo:", error);
      toast.error("No se pudo obtener el número de equipo.");
      return;
    }
  } else {
    idEquipo = idEquipoEnEdicion;
  }

  // Construir los nuevos estudiantes
  const nuevosEstudiantes = formulariosEquipo.map((est) => {
    const areaSeleccionada = areas.find((a) => a.id_area === parseInt(est.area));
    const categoriaSeleccionada = categorias.find(
      (c) => c.id_categoria === parseInt(est.categoria)
    );

    return {
      ...est,
      id_area: areaSeleccionada?.id_area ?? null,
      nombre_area: areaSeleccionada?.nombre_area ?? "",
      id_categoria: categoriaSeleccionada?.id_categoria ?? null,
      nombre_categoria: categoriaSeleccionada?.nombre_categoria ?? "",
      id_equipo: idEquipo,
      team: idEquipo // <- este es el campo que el backend espera
    };
  });

  // Enviar a la API `/inscripcion`
  const datosEnviar = {
    id_formulario_actual: parseInt(id),
    id_convocatoria: idConvocatoria,
    estudiantes: nuevosEstudiantes.map((est) => ({
      id_estudiante: null,
      nombre: est.nombre,
      apellido: est.apellido,
      email: est.email,
      ci: parseInt(est.ci),
      fecha_nacimiento: est.fechaNac,
      rude: parseInt(est.rude),
      idAarea: est.id_area,
      idCategoria: est.id_categoria,
      team: est.team
    }))
  };

  try {
    const res = await api.post("/inscripcion", datosEnviar);
    // Si el formulario fue recién creado, guardamos el ID para próximas inscripciones
    if (parseInt(id) === 0 && res.data?.id_formulario) {
      navigate(`/formulario/${res.data.id_formulario}`);
      return;
    }
    if (res.data.estudiantes) {
  setRowData((prev) => {
    if (modoEdicion && idEquipoEnEdicion !== null) {
      const sinEquipoAnterior = prev.filter(e => e.id_equipo !== idEquipoEnEdicion);
      return [...sinEquipoAnterior, ...res.data.estudiantes];
    } else {
      return [...prev, ...res.data.estudiantes];
    }
  });
}
    toast.success("Estudiantes registrados correctamente en el sistema.");
  } catch (error) {
    console.error("Error al registrar estudiantes en backend:", error);
    toast.error("Error al registrar estudiantes en el servidor.");
    return;
  }




  // Reset
  toast.success(`Equipo registrado correctamente.`);
  setContadorEquipos((prev) => prev + 1);
  setFormulariosEquipo(
    Array.from({ length: numParticipantes }, () => ({
      nombre: "", apellido: "", ci: "", fechaNac: "", rude: "", area: "", categoria: "", email: ""
    }))
  );
  setFormIndexActivo(0);
  setSelectedRows([]);
  selectedRowsRef.current = [];
  setToggleClearSelected((prev) => !prev);
  setModoEdicion(false);
  setIdEquipoEnEdicion(null);
};





const handleEditar = async () => {
  const seleccionActual = selectedRowsRef.current;

  if (seleccionActual.length === 0) {
    return toast.warn("Por favor selecciona un equipo para editar.");
  }

  const idEquipo = seleccionActual[0]?.id_equipo;
  const mismosEquipos = seleccionActual.every(est => est.id_equipo === idEquipo);

  if (!mismosEquipos) {
    return toast.warn("Solo puedes editar estudiantes del mismo equipo.");
  }

  const result = await MySwal.fire({
    title: '¿Editar equipo?',
    text: "Podrás editar a todos los estudiantes del grupo al que pertenece el seleccionado",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, editar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  const equipoCompleto = rowData.filter(est => est.id_equipo === idEquipo);

  const cantidad = equipoCompleto.length;


  setNumParticipantes(cantidad);
  setFormIndexActivo(0);
  setFormulariosEquipo(
    equipoCompleto.map(est => ({
      nombre: est.nombre,
      apellido: est.apellido,
      ci: est.ci,
      fechaNac: est.fechaNac,
      rude: est.rude,
      area: est.id_area?.toString() || "",
      categoria: est.id_categoria?.toString() || "",
      email: est.email
    }))
  );

  setModoEdicion(true);
  setIdEquipoEnEdicion(idEquipo);
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

  if (seleccionActual.length === 0) {
    return toast.warn("Por favor selecciona un estudiante para eliminar.");
  }

  const estudianteBase = seleccionActual[0];
  const idEquipo = estudianteBase.id_equipo;

  if (!idEquipo || !estudianteBase.id_area || !estudianteBase.id_categoria) {
    toast.error("Faltan datos necesarios para eliminar el equipo.");
    console.warn("Datos faltantes:", estudianteBase);
    return;
  }

  const estudiantesAEliminar = rowData.filter(est => est.id_equipo === idEquipo);

  const result = await MySwal.fire({
    title: '¿Eliminar equipo?',
    text: `Se eliminarán ${estudiantesAEliminar.length} estudiante(s) del equipo ${idEquipo}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });

  if (!result.isConfirmed) return;

  try {
    console.log("Eliminando equipo con datos:", {
      id_formulario: parseInt(id),
      id_estudiante: estudianteBase.id_estudiante,
      idArea: estudianteBase.id_area,
      idCategoria: estudianteBase.id_categoria,
      idEquipo: estudianteBase.id_equipo,
    });

    await api.delete('/eliminar-registro-estudiante', {
      data: {
        id_formulario: parseInt(id),
        id_estudiante: estudianteBase.id_estudiante,
        idArea: estudianteBase.id_area,
        idCategoria: estudianteBase.id_categoria,
        idEquipo: estudianteBase.id_equipo
      }
    });

    // Actualizar tabla local
    setRowData((prev) => prev.filter(est => est.id_equipo !== idEquipo));
    setSelectedRows([]);
    selectedRowsRef.current = [];
    setToggleClearSelected(prev => !prev);

    toast.success('Estudiantes del equipo eliminados correctamente.');
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    toast.error('Error al eliminar estudiante inscrito.');
  }
};




const handleGuardarFormulario = async () => {
  toast.info("Todos los estudiantes ya han sido registrados.");
  navigate(`/inscripciones?convocatoria=${idConvocatoria}`);
};


const actualizarFormulario = (index, campo, valor) => {
  setFormulariosEquipo((prev) => {
    const nuevos = [...prev];
    nuevos[index][campo] = valor;
    return nuevos;
  });
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
        


        <Caja
          titulo={`Formulario de Inscripción #${id}`}
          width="99%"
          className="caja-formulario-est"
        >
        <p>Escoge un Área y Categoria para inscribir</p>
        <RegistroForm
                label="Área"
                name="area"
                type="select"
                value={formulariosEquipo[formIndexActivo].area}
                onChange={(e) =>
                  actualizarFormulario(formIndexActivo, "area", e.target.value)
                }
                usarEvento={true}
                options={[
                  { value: "", label: "Seleccione una Área" },
                  ...areas.map((area) => ({
                    value: area.id_area,
                    label: area.nombre_area,
                  })),
                ]}
              />
              <RegistroForm
                label="Categoria"
                name="categoria"
                type="select"
                value={formulariosEquipo[formIndexActivo].categoria}
                onChange={(e) =>
                  actualizarFormulario(formIndexActivo, "categoria", e.target.value)
                }
                usarEvento={true}
                options={[
                  { value: "", label: "Seleccione una Categoria" },
                  ...categorias.map((cat) => ({
                    value: cat.id_categoria,
                    label: cat.nombre_categoria,
                  })),
                ]}
              />
              
          <p>Se habilitarán uno o más formularios de inscripcion segun la categoria que has eligido:</p>
          <div className="tabs-participantes">
            {Array.from({ length: numParticipantes }, (_, index) => (
              <button
                key={index}
                className={`tab-boton-form-ins ${index === formIndexActivo ? "activo" : ""}`}
                onClick={() => setFormIndexActivo(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="contenedor-secciones-form">
            <section className="seccion-form">
              <RegistroForm
                label="Nombres"
                name="nombre"
                value={formulariosEquipo[formIndexActivo].nombre}
                onChange={(e) =>
                  actualizarFormulario(formIndexActivo, "nombre", e.target.value)
                }
                usarEvento={true}
                icono={FaRegUser}
              />
              <RegistroForm
                label="C.I."
                name="ci"
                value={formulariosEquipo[formIndexActivo].ci}
                onChange={(e) =>
                  actualizarFormulario(formIndexActivo, "ci", e.target.value)
                }
                usarEvento={true}
                icono={FaAddressCard}
              />
              <RegistroForm
                label="Fecha de nacimiento"
                name="fechaNac"
                type="date"
                value={formulariosEquipo[formIndexActivo].fechaNac}
                onChange={(e) =>
                  actualizarFormulario(formIndexActivo, "fechaNac", e.target.value)
                }
                usarEvento={true}
                icono={MdOutlineDateRange}
              />
              
            </section>

            <section className="seccion-form">
              <RegistroForm
                label="Apellidos"
                name="apellido"
                value={formulariosEquipo[formIndexActivo].apellido}
                onChange={(e) =>
                  actualizarFormulario(formIndexActivo, "apellido", e.target.value)
                }
                usarEvento={true}
                icono={FaRegUser}
              />
              <RegistroForm
                label="Rude"
                name="rude"
                value={formulariosEquipo[formIndexActivo].rude}
                onChange={(e) =>
                  actualizarFormulario(formIndexActivo, "rude", e.target.value)
                }
                usarEvento={true}
                icono={PiStudentFill}
              />
              
              <RegistroForm
                label="Email"
                name="email"
                value={formulariosEquipo[formIndexActivo].email}
                onChange={(e) =>
                  actualizarFormulario(formIndexActivo, "email", e.target.value)
                }
                usarEvento={true}
                icono={MdEmail}
              />
            </section>
          </div>
        </Caja>


        
        <div className="contenedor-boton-registrar-est">
          <BotonForm
          className="boton-ins-lista"
          texto="Subir lista"
          onClick={() => fileInputRef.current.click()}
        />
          <BotonForm
            className="boton-ins-guardar"
            texto={modoEdicion ? "Guardar" : "Registrar"}
            onClick={handleRegistrar}
          />
        </div>
        <Caja titulo="Estudiantes inscritos" width="99%">
          <DataTable
            columns={columns}
            data={rowData}
            selectableRows
            selectableRowsNoSelectAll
            clearSelectedRows={toggleClearSelected}
            onSelectedRowsChange={({ selectedRows }) => {
  if (selectedRows.length === 0) {
    setSelectedRows([]);
    selectedRowsRef.current = [];
    return;
  }

  const primerSeleccionado = selectedRows[0];
  const idEquipo = primerSeleccionado.id_equipo;

  // Obtener todos los estudiantes del mismo equipo
  const mismoEquipo = rowData.filter(est => est.id_equipo === idEquipo);

  setSelectedRows(mismoEquipo);
  selectedRowsRef.current = mismoEquipo;
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