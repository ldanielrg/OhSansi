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
  const [categoriasExcel, setCategoriasExcel] = useState([]);
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
const [idEstudianteEnEdicion, setIdEstudianteEnEdicion] = useState(null);
const [registrando, setRegistrando] = useState(false);
const [loadingAreas, setLoadingAreas] = useState(false);
const [loadingTabs, setLoadingTabs] = React.useState(false);







  


const columns = [
  { name: "Nombre", selector: (row) => row.nombre, sortable: true },
  { name: "Apellido", selector: (row) => row.apellido, sortable: true },
  { name: "CI", selector: (row) => row.ci },
  { name: "Fecha de Nacimiento", selector: (row) => row.fechaNac },
  { name: "Rude", selector: (row) => row.rude },
  { name: "Área", selector: (row) => row.nombre_area },
  { name: "Categoría", selector: (row) => row.nombre_categoria },
  { name: "Id equipo", selector: (row) => row.id_equipo }
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
    setLoadingAreas(true);
    try {
      const res = await api.get(`/areas/${idConvocatoria}`);
      const res2 = await api.get(`/categoriasC/${idConvocatoria}`);
      setAreas(res.data);
      setCategoriasExcel(res2.data);
    } catch (error) {
      console.error("Error al obtener áreas:", error);
      toast.error("Error al obtener las áreas.");
    }finally {
      setLoadingAreas(false);
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

  const controller = new AbortController();
  const signal = controller.signal;

  const cargarCategorias = async () => {
    try {
      const res = await api.get(`/categorias/${areaActual}`, { signal });
      setCategorias(res.data);
    } catch (error) {
      if (error.name === "CanceledError") {
        // petición cancelada, no hacemos nada
      } else {
        console.error("Error al obtener categorías:", error);
        toast.error("Error al obtener las categorías.");
      }
    }
  };

  cargarCategorias();

  return () => {
    controller.abort(); // cancela petición anterior al cambiar area o desmontar
  };
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

  // ⛔ Evita reiniciar si estás editando un estudiante o faltan datos
  if (!area || !categoria || modoEdicion) return;

  const obtenerCantidadParticipantes = async () => {
    try {
      setLoadingTabs(true); // Activar loader

      const res = await api.get(`/participantes`, {
        params: {
          id_area: area,
          id_categoria: categoria
        }
      });

      const cantidad = parseInt(res.data?.cantidad || 1);

      setNumParticipantes(cantidad);
      setFormIndexActivo(0);
      setFormulariosEquipo(
        Array.from({ length: cantidad }, () => ({
          nombre: "", apellido: "", ci: "", fechaNac: "", rude: "", area, categoria, email: ""
        }))
      );

    } catch (error) {
      toast.error("No se pudo obtener la cantidad de integrantes para esta categoría.");
    } finally {
      setLoadingTabs(false); // Desactivar loader
    }
  };

  obtenerCantidadParticipantes();
}, [formulariosEquipo[formIndexActivo]?.categoria]);





  

  const opcionesFiltradasUE = ue
    .filter((item) => item.municipio_id === parseInt(formData.municipio))
    .map((item) => ({ value: item.id_ue, label: item.nombre_ue }));



const handleRegistrar = async () => {
  if (registrando) return;

  // Validaciones primero
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

    if (!fechaNac || isNaN(fechaNacimiento))
      return toast.warn(`Fecha de nacimiento inválida en integrante ${i + 1}`);
    if (fechaNacimiento > hoy)
      return toast.warn(`La fecha no puede ser en el futuro (integrante ${i + 1})`);

    // Cálculo de edad
    //const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    //const m = hoy.getMonth() - fechaNacimiento.getMonth();
    //if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      // Si no ha cumplido años este año
    //  edad--;
    //}

    //if (edad < 7)
    //  return toast.warn(`La edad mínima requerida es 7 años (integrante ${i + 1})`);
    
  }

  // ✅ Solo después de las validaciones
  setRegistrando(true);

  let idEquipo = contadorEquipos;

  if (!modoEdicion) {
    try {
      const area = formulariosEquipo[0].area;
      const categoria = formulariosEquipo[0].categoria;

      const res = await api.get('/dame-mi-team', {
        params: { id_area: area, id_categoria: categoria }
      });

      idEquipo = res.data.siguiente_team;
    } catch (error) {
      console.error("Error al obtener el número de equipo:", error);
      toast.error("No se pudo obtener el número de equipo.");
      setRegistrando(false); // ← necesario aquí también
      return;
    }
  } else {
    idEquipo = idEquipoEnEdicion;
  }

  const nuevosEstudiantes = formulariosEquipo.map((est) => {
    const areaSeleccionada = areas.find((a) => a.id_area === parseInt(est.area));
    const categoriaSeleccionada = categorias.find((c) => c.id_categoria === parseInt(est.categoria));

    return {
      ...est,
      id_area: areaSeleccionada?.id_area ?? null,
      nombre_area: areaSeleccionada?.nombre_area ?? "",
      id_categoria: categoriaSeleccionada?.id_categoria ?? null,
      nombre_categoria: categoriaSeleccionada?.nombre_categoria ?? "",
      id_equipo: idEquipo,
      team: idEquipo
    };
  });

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
    console.log("ESTO VA ANTES DE MODO EDICIÓN")
    if (modoEdicion) {
      const estudiante = formulariosEquipo[0];
      console.log("ENTRANDO A MI IF")
      const payload = {
        id_formulario: parseInt(id),
        anterior: {
          id_estudiante: idEstudianteEnEdicion
        },
        nuevo: {
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          email: estudiante.email,
          ci: parseInt(estudiante.ci),
          rude: parseInt(estudiante.rude),
          fecha_nacimiento: estudiante.fechaNac
        }
      };

      try {
        await api.post('/editar-registro-estudiante', payload);
        toast.success('Estudiante actualizado correctamente.');

        // actualiza la tabla
        setRowData(prev => prev.map(est =>
          est.id_estudiante === idEstudianteEnEdicion
            ? { ...est, ...payload.nuevo, fechaNac: payload.nuevo.fecha_nacimiento }
            : est
        ));
      } catch (error) {
        console.error('Error al editar estudiante:', error);
        toast.error(error.response?.data?.message || 'Error al actualizar el estudiante.');
      } finally {
        setRegistrando(false);
        resetEdicion();
      }

      return;
    }
    const res = await api.post("/inscripcion", datosEnviar);

    if (parseInt(id) === 0 && res.data?.id_formulario) {
      navigate(`/formulario/${res.data.id_formulario}`);
      return;
    }

    if (res.data.estudiantes) {
  const estudiantesNormalizados = res.data.estudiantes.map(est => ({
    ...est,
    fechaNac: est.fecha_nac // 👈 transforma correctamente aquí
  }));

  setRowData((prev) => {
    if (modoEdicion && idEquipoEnEdicion !== null) {
      const sinEquipoAnterior = prev.filter(e => e.id_equipo !== idEquipoEnEdicion);
      return [...sinEquipoAnterior, ...estudiantesNormalizados];
    } else {
      return [...prev, ...estudiantesNormalizados];
    }
  });
}



    toast.success("Estudiantes registrados correctamente en el sistema.");
    setFormulariosEquipo(
  Array.from({ length: numParticipantes }, () => ({
    nombre: "",
    apellido: "",
    ci: "",
    fechaNac: "",
    rude: "",
    area: "",
    categoria: "",
    email: "",
    team: 0,
  }))
);
setFormIndexActivo(0);

  } catch (error) {
    console.error("Error al registrar estudiantes en backend:", error);
    toast.error("Error al registrar estudiantes en el servidor.");
  } finally {
    setRegistrando(false); // ✅ Siempre se reinicia
  }

  // Reset
  toast.success(`Equipo registrado correctamente.`);
  setContadorEquipos((prev) => prev + 1);
  setFormulariosEquipo(Array.from({ length: numParticipantes }, () => ({
    nombre: "", apellido: "", ci: "", fechaNac: "", rude: "", area: "", categoria: "", email: ""
  })));
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

  const estudiante = seleccionActual[0];

  setFormulariosEquipo([{
    nombre: estudiante.nombre,
    apellido: estudiante.apellido,
    ci: estudiante.ci,
    fechaNac: estudiante.fechaNac,
    rude: estudiante.rude,
    area: estudiante.id_area?.toString() || "",
    categoria: estudiante.id_categoria?.toString() || "",
    email: estudiante.email
  }]);

  setNumParticipantes(1);
  setFormIndexActivo(0);
  setModoEdicion(true);
  setIdEquipoEnEdicion(estudiante.id_equipo); // opcional
  setIdEstudianteEnEdicion(estudiante.id_estudiante); // ✅ necesario


    setModoEdicion(true);
    setIdEquipoEnEdicion(idEquipo);
  };

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      setSelectedRows([]);
      selectedRowsRef.current = [];

      const workbook = XLSX.read(data, { type: "array" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const rows = jsonData.slice(13); // Saltar encabezados o filas que no interesan

      if (rows.length === 0) {
        toast.error("El archivo no contiene datos válidos.");
        return;
      }

      const nuevosEstudiantes = [];
      const errores = [];

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
          team,
        ] = fila;

        if (
          !nombre || !apellido || !ci || !fechaNacOriginal || !rude || !area || !categoria || !team
        ) {
          errores.push(`Fila ${i + 14}: Algún campo está vacío.`);
          continue;
        }

        let fechaNac = fechaNacOriginal;
        if (typeof fechaNac === "number") {
          const excelStartDate = new Date(1900, 0, 1);
          excelStartDate.setDate(excelStartDate.getDate() + fechaNac - 2);
          fechaNac = excelStartDate.toISOString().split("T")[0];
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
          team: team.toString(),
        });
      }

      if (errores.length > 0) {
        errores.forEach(err => toast.error(err));
        return;
      }

      // Mapear nombres a IDs
      const estudiantesParaEnviar = [];
      for (const est of nuevosEstudiantes) {
        const areaObj = areas.find(a => a.nombre_area.trim().toLowerCase() === est.nombre_area.trim().toLowerCase());
        const categoriaObj = categoriasExcel.find(c => c.nombre_categoria.trim().toLowerCase() === est.nombre_categoria.trim().toLowerCase());

        if (!areaObj) {
          errores.push(`Área no encontrada: "${est.nombre_area}" para ${est.nombre} ${est.apellido}`);
          continue;
        }
        if (!categoriaObj) {
          errores.push(`Categoría no encontrada: "${est.nombre_categoria}" para ${est.nombre} ${est.apellido}`);
          continue;
        }

        estudiantesParaEnviar.push({
          id_estudiante: null,
          nombre: est.nombre,
          apellido: est.apellido,
          email: est.email,
          ci: parseInt(est.ci),
          fecha_nacimiento: est.fechaNac,
          rude: parseInt(est.rude),
          idAarea: areaObj.id_area,
          idCategoria: categoriaObj.id_categoria,
          team: parseInt(est.team),
        });
      }

      if (errores.length > 0) {
        errores.forEach(err => toast.error(err));
        return;
      }

      if (estudiantesParaEnviar.length === 0) {
        toast.error("No hay estudiantes válidos para enviar.");
        return;
      }

      const datosEnviar = {
        id_formulario_actual: parseInt(id),
        id_convocatoria: idConvocatoria,
        estudiantes: estudiantesParaEnviar,
      };

      // Enviar a backend
      const res = await api.post("/inscripcion", datosEnviar);

      if (res.data && res.data.estudiantes) {
        const estudiantesNormalizados = res.data.estudiantes.map((est) => ({
          ...est,
          fechaNac: est.fecha_nac,
        }));
        setRowData((prev) => [...prev, ...estudiantesNormalizados]);
        toast.success(`¡Se agregaron ${estudiantesNormalizados.length} estudiantes correctamente!`);
      } else {
        toast.error("Error: no se recibieron estudiantes del servidor.");
      }
    } catch (error) {
      console.error("Error leyendo archivo o enviando datos:", error);
      toast.error("Error al procesar el archivo o enviar datos.");
    } finally {
      event.target.value = ""; // Limpiar input para poder subir el mismo archivo después si se quiere
    }
  };

  reader.readAsArrayBuffer(file);
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

const resetEdicion = () => {
  setModoEdicion(false);
  setIdEstudianteEnEdicion(null);
  setFormulariosEquipo([{
    nombre: "", apellido: "", ci: "", fechaNac: "", rude: "", area: "", categoria: "", email: ""
  }]);
  setFormIndexActivo(0);
  setSelectedRows([]);
  selectedRowsRef.current = [];
  setToggleClearSelected(prev => !prev);
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
            href="/plantillas/FormatoParaSubirLista.xlsx"
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
                options={
                  loadingAreas
                    ? [{ value: "", label: "Cargando áreas..." }]
                    : [
                        { value: "", label: "Seleccione una Área" },
                        ...areas.map((area) => ({
                          value: area.id_area,
                          label: area.nombre_area,
                        })),
                      ]
                }
                disabled={loadingAreas}
              />

              <RegistroForm
  label="Categoría"
  name="categoria"
  type="select"
  value={formulariosEquipo[formIndexActivo].categoria}
  onChange={(e) =>
    actualizarFormulario(formIndexActivo, "categoria", e.target.value)
  }
  usarEvento={true}
  options={[
    { value: "", label: "Seleccione una Categoría" },
    ...categorias.map((cat) => ({
      value: cat.id_categoria,
      label: cat.nombre_categoria,
    })),
  ]}
/>

              
          <p>Se habilitarán uno o más formularios de inscripcion segun la categoria que has eligido:</p>
          {loadingTabs ? (
  <div style={{ padding: "1rem", textAlign: "center" }}>
    <BallTriangle height={40} width={40} color="#003366" />
  </div>
) : (
  <>
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
                className='registro-form-ins-nombre'
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
           </>
)}
        </Caja>


        
        <div className="contenedor-boton-registrar-est">
          <BotonForm
          className="boton-ins-lista"
          texto="Subir lista"
          onClick={() => fileInputRef.current.click()}
        />
          <BotonForm
  className="boton-ins-guardar"
  texto={registrando ? "Registrando..." : (modoEdicion ? "Guardar" : "Registrar")}
  onClick={handleRegistrar}
  disabled={registrando}
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