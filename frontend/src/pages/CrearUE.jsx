import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import '../styles/CrearUE.css'; // estilos específicos del formulario

const CrearUE = () => {
  const navigate = useNavigate();

  const initialForm = {
    id: null,
    nombre: '',
    rue: '',
    departamento_id: '',
    municipio_id: ''
  };
  
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  //TABLA Y EDICION
  const [unidadesEducativas, setUnidadesEducativas] = useState([]); //AGREGUE PARA LA TABLA
  const [selectedUEs, setSelectedUEs] = useState([]); //AGREGUE PARA LA TABLA
  const [editIndex, setEditIndex] = useState(null); //AGREGUE PARA LA TABLA
  const [modoEdicion, setModoEdicion] = useState(false); //AGREGUE PARA LA TABLA

  // Columnas de la tabla
  const columns = [
    { name: 'Nombre', selector: row => row.nombre, sortable: true },
    { name: 'RUE', selector: row => row.rue },
    { name: 'Departamento', selector: row => row.departamento_nombre || '—' },
    { name: 'Municipio', selector: row => row.municipio_nombre || '—' },
  ];

  useEffect(() => {
    fetch('http://localhost:8000/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data));
      // Cargar las unidades educativas existentes, //AGREGUE PARA LA TABLA
    fetch('http://localhost:8000/api/unidades-educativas')
    .then(res => res.json())
    .then(data => setUnidadesEducativas(data));
  }, []);

  const handleDepartamentoChange = (selected) => {
    const id = selected?.value || '';
    setForm({ ...form, departamento_id: id, municipio_id: '' });

    fetch(`http://localhost:8000/api/municipios/${id}`)
      .then(res => res.json())
      .then(data => setMunicipios(data));
  };

  const handleMunicipioChange = (selected) => {
    setForm({ ...form, municipio_id: selected?.value || '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  

  const validateForm = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = 'Este campo es obligatorio.';
    } else if (!form.nombre.startsWith('Unidad Educativa')) {
      newErrors.nombre = 'Debe comenzar con "Unidad Educativa".';
    } else if (!/^Unidad Educativa\s[a-zA-Z0-9\sáéíóúÁÉÍÓÚüÜñÑ.,-]{1,87}$/.test(form.nombre)) {
      newErrors.nombre = 'Después de "Unidad Educativa", Debe Ingresar el nombre de la Unidad Educativa.';
    } else if (form.nombre.length > 100) {
      newErrors.nombre = 'Máximo 100 caracteres permitidos.';
    }
    

    if (!form.rue.trim()) {
      newErrors.rue = 'Este campo es obligatorio.';
    } else if (!/^\d{1,8}$/.test(form.rue)) {
      newErrors.rue = 'Solo números, máximo 8 dígitos.';
    }

    if (!form.departamento_id) {
      newErrors.departamento_id = 'Selecciona un departamento.';
    }

    if (!form.municipio_id) {
      newErrors.municipio_id = 'Selecciona un municipio.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    const endpoint = modoEdicion
      ? `http://localhost:8000/api/unidad-educativa/${form.id}`
      : 'http://localhost:8000/api/unidad-educativa';
  
    const method = modoEdicion ? 'PUT' : 'POST';
  
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
  
      if (res.status === 409) {
        alert('⚠️ El RUE ingresado ya existe.');
      } else if (res.ok) {
        if (modoEdicion) {
          // Actualizar la unidad educativa en la tabla local
          const nuevasUEs = [...unidadesEducativas];
          nuevasUEs[editIndex] = data;
          setUnidadesEducativas(nuevasUEs);
        } else {
          // Agregar nueva unidad educativa a la tabla local
          setUnidadesEducativas(prev => [...prev, data]);
        }
  
        alert(`✅ Unidad Educativa ${modoEdicion ? 'actualizada' : 'creada'} con éxito.`);
  
        // Resetear el formulario y estados auxiliares
        //setForm({ nombre: '', rue: '', departamento_id: '', municipio_id: '' });
        setForm(initialForm);
        setMunicipios([]);
        setErrors({});
        setModoEdicion(false);
        setEditIndex(null);
      } else if (res.status === 422) {
        setErrors(data.errors || {});
      } else {
        alert(data.message || 'Ocurrió un error al registrar la Unidad Educativa.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor, porque sera');
    }
  };

  //PARA EDITAR
  const handleEditar = () => {
  if (selectedUEs.length === 0) {
    alert('NO seleccionaste ningun dato para editar.');
    return;
  }
  
  if (selectedUEs.length > 1) {
    alert('Solo selecciona un dato para editar.');
    return;
  }

  const seleccionada = selectedUEs[0];
  const index = unidadesEducativas.findIndex(ue => ue.id === seleccionada.id);

  setForm({ 
    id: seleccionada.id,
    nombre: seleccionada.nombre,
    rue: seleccionada.rue,
    departamento_id: seleccionada.departamento_id,
    municipio_id: seleccionada.municipio_id
  });
  setEditIndex(index);
  setModoEdicion(true);

  // Cargar municipios del departamento seleccionado
  fetch(`http://localhost:8000/api/municipios/${seleccionada.departamento_id}`)
    .then(res => res.json())
    .then(data => setMunicipios(data));

    //HACER UN SCROLL, HACIA EL FORMULARIO
    document.getElementById('formulario-ue')?.scrollIntoView({ behavior: 'smooth' });

  };

  //FUNCION PARA ELIMINAR
  const handleEliminar = async () => {
    if (selectedUEs.length === 0) {
      alert('NO seleccionaste ningun dato para eliminar.');
      return;
    }

    if (selectedUEs.length > 1) {
      alert('Solo selecciona un dato para eliminar.');
      return;
    }

    const ue = selectedUEs[0]; //UNIDAD EDUCATIVA SELECCIONADA
    const confirmacion = window.confirm(`⚠️ ¿Estás seguro de eliminar la: \n"${ue.nombre}"?`);

  
    if (!confirmacion) return;
  
    try {
      await fetch(`http://localhost:8000/api/unidad-educativa/${ue.id}`, {
        method: 'DELETE',
      });  
  
      const nuevasUEs = unidadesEducativas.filter(item => item.id !== ue.id);
  
      setUnidadesEducativas(nuevasUEs);
      setSelectedUEs([]);
      alert('✅ "${ue.nombre}", fue eliminada correctamente.');
    } catch (error) {
      console.error(error);
      alert('❌ Error al eliminar.');
    }
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#f0f8ff',  // color claro de fondo opcional (puedes quitarlo)
        color: '#3498db',            // 🔵 texto azul
        fontWeight: 'bold',
        fontSize: '14px',
        textAlign: 'center',
        paddingLeft: '0px',          // 🔧 elimina margen a la izquierda
        paddingRight: '0px',         // 🔧 elimina margen a la derecha
        margin: 0,
      },
    },
    headRow: {
      style: {
        backgroundColor: '#eaf4fe',
        borderBottom: '1px solid #ccc',
        padding: 0,                 // 🔧 importante para que cubra bien el scroll
        margin: 0,
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        textAlign: 'center',
      },
    },
  };
  

  return (
    <div className="crear-ue-container" id="formulario-ue">
      <div className="titulo-box">Crear Unidad Educativa</div>

      <div className="form-row">
      <div className="form-group">
      <label>Nombre de Unidad Educativa</label>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Unidad Educativa San Pedro"
        className={`form-input ${
          errors.nombre
            ? 'input-error'
            : form.nombre.startsWith('Unidad Educativa') && form.nombre.trim()
            ? 'input-valid'
            : ''
        }`}
      />
        {errors.nombre && <span className="error-text">{errors.nombre}</span>}
      </div>

      <div className="form-group">
        <label>RUE</label>
        <input
          type="text"
          name="rue"
          value={form.rue}
          onChange={handleChange}
          placeholder="Ej: 30302014"
          className={`form-input ${
          errors.rue
            ? 'input-error'
            : /^\d{1,8}$/.test(form.rue) && form.rue.trim()
            ? 'input-valid'
            : ''
        }`}
          />
          {errors.rue && <span className="error-text">{errors.rue}</span>}
        </div>
      </div>


      <div className="form-row">
        <div className="form-group select-con-espacio">
          <label>Departamento</label>
          <Select
            className="limitar-opciones"
            classNamePrefix="react-select"
            options={departamentos.map(dep => ({ value: dep.id, label: dep.nombre }))}
            value={departamentos.find(dep => dep.id === form.departamento_id)
              ? {
                  value: form.departamento_id,
                  label: departamentos.find(dep => dep.id === form.departamento_id)?.nombre
                }
              : null
            }
            onChange={handleDepartamentoChange}
            placeholder="Selecciona un departamento"
          />
          {errors.departamento_id && <span className="error-text">{errors.departamento_id}</span>}
        </div>

        <div className="form-group">
          <label>Municipio</label>
          <Select
            className="limitar-opciones"
            classNamePrefix="react-select"
            options={municipios.map(mun => ({ value: mun.id, label: mun.nombre }))}
            value={municipios.find(mun => mun.id === form.municipio_id)
              ? {
                  value: form.municipio_id,
                  label: municipios.find(mun => mun.id === form.municipio_id)?.nombre
                }
              : null
            }
            onChange={handleMunicipioChange}
            placeholder="Selecciona un municipio"
            isDisabled={!municipios.length}
          />
          {errors.municipio_id && <span className="error-text">{errors.municipio_id}</span>}
        </div>
      </div>

      <div className="form-buttons">
        <button
          className="btn-cancelar"
          onClick={() => {
            //setForm({ nombre: '', rue: '', departamento_id: '', municipio_id: '' });
            setForm(initialForm);
            setErrors({});
            navigate(-1);
          }}
        >
          Cancelar
        </button>

        <button className="btn-guardar" onClick={handleSubmit}>
          Añadir
        </button>
      </div>
    <div className="tabla-ue-box">
      <h3 className="titulo-tabla-ue">Unidades Educativas Agregadas</h3>

        <DataTable
          columns={columns}
          data={unidadesEducativas}
          selectableRows
          selectableRowSingle
          selectableRowsNoSelectAll 
          onSelectedRowsChange={({ selectedRows }) => setSelectedUEs(selectedRows)}
          pagination={false}
          responsive
          fixedHeader
          fixedHeaderScrollHeight='300px'
          customStyles={customStyles}
        />
   
      <div className="form-buttons">
        <button className="btn-editar" onClick={handleEditar}>Editar</button>
        <button className="btn-eliminar" onClick={handleEliminar}>Eliminar</button>
      </div>
    </div>
    </div>
  );
};

export default CrearUE;
