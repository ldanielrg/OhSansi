import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import '../styles/CrearUE.css'; // estilos específicos del formulario
import api from '../api/axios';

const CrearUE = () => {
  const navigate = useNavigate();

  const initialForm = {
    id: null,
    nombre: '',
    rue: null,
    departamento_id: '',
    municipio_id: ''
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [unidadesEducativas, setUnidadesEducativas] = useState([]);
  const [selectedUEs, setSelectedUEs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Columnas de la tabla
  const columns = [
    { name: 'Nombre', selector: row => row.nombre, sortable: true },
    { name: 'RUE', selector: row => row.rue },
    { name: 'Departamento', selector: row => row.departamento_nombre || '—' },
    { name: 'Municipio', selector: row => row.municipio_nombre || '—' },
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [departamentosRes, unidadesRes] = await Promise.all([
          api.get('/departamentos'),
          api.get('/unidades-educativas')
        ]);
        setDepartamentos(departamentosRes.data);
        // Mapear para usar nombres consistentes
        setUnidadesEducativas(unidadesRes.data.map(ue => ({
          id: ue.id_ue,
          nombre: ue.nombre_ue,
          rue: ue.rue,
          departamento_id: ue.departamento_id,
          municipio_id: ue.municipio_id,
          departamento_nombre: ue.departamento_nombre,
          municipio_nombre: ue.municipio_nombre,
        })));
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };

    cargarDatos();
  }, []);

  const handleDepartamentoChange = async (selected) => {
    const id = selected?.value || '';
    setForm({ ...form, departamento_id: id, municipio_id: '' });

    try {
      const res = await api.get(`/municipios/${id}`);
      setMunicipios(res.data);
    } catch (error) {
      console.error('Error al cargar municipios:', error);
      setMunicipios([]);
    }
  };

  const handleMunicipioChange = (selected) => {
    setForm({ ...form, municipio_id: selected?.value || '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prevForm => ({
      ...prevForm,
      [name]: name === 'rue' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!form.nombre.trim()) {
      newErrors.nombre = 'Este campo es obligatorio.';
    } else if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚüÜñÑ.,-]{1,87}$/.test(form.nombre)) {
      newErrors.nombre = 'Después de "Unidad Educativa", Debe Ingresar el nombre de la Unidad Educativa.';
    } else if (form.nombre.length > 100) {
      newErrors.nombre = 'Máximo 100 caracteres permitidos.';
    }

    // Validar rue numérico
    if (form.rue === null || form.rue === undefined || form.rue === '') {
      newErrors.rue = 'Este campo es obligatorio.';
    } else if (!Number.isInteger(form.rue) || form.rue < 0 || form.rue.toString().length > 8) {
      newErrors.rue = 'Solo números enteros positivos, máximo 8 dígitos.';
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
      ? `/unidad-educativa/${form.id}`
      : '/unidad-educativa';

    // Preparar payload con nombres backend
    const payload = {
      id_ue: form.id,
      nombre_ue: form.nombre,
      rue: form.rue,
      departamento_id: form.departamento_id,
      municipio_id: form.municipio_id
    };

    try {
      const res = modoEdicion
        ? await api.put(endpoint, payload)
        : await api.post(endpoint, payload);

      const data = res.data;

      // Mapear respuesta para frontend
      const ueMapeada = {
        id: data.id_ue,
        nombre: data.nombre_ue,
        rue: data.rue,
        departamento_id: data.departamento_id,
        municipio_id: data.municipio_id,
        departamento_nombre: data.departamento_nombre,
        municipio_nombre: data.municipio_nombre,
      };

      if (modoEdicion) {
        const nuevasUEs = [...unidadesEducativas];
        nuevasUEs[editIndex] = ueMapeada;
        setUnidadesEducativas(nuevasUEs);
      } else {
        setUnidadesEducativas(prev => [...prev, ueMapeada]);
      }

      alert(`✅ Unidad Educativa ${modoEdicion ? 'actualizada' : 'creada'} con éxito.`);

      setForm(initialForm);
      setMunicipios([]);
      setErrors({});
      setModoEdicion(false);
      setEditIndex(null);

    } catch (error) {
      if (error.response?.status === 409) {
        alert('⚠️ El RUE ingresado ya existe.');
      } else if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error(error);
        alert('❌ Ocurrió un error al registrar la Unidad Educativa.');
      }
    }
  };

  // Para editar
  const handleEditar = async () => {
    if (selectedUEs.length !== 1) {
      alert('Debes seleccionar exactamente una Unidad Educativa para editar.');
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

    try {
      const res = await api.get(`/municipios/${seleccionada.departamento_id}`);
      setMunicipios(res.data);
    } catch (error) {
      console.error('Error al cargar municipios para edición:', error);
      setMunicipios([]);
    }

    document.getElementById('formulario-ue')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Función para eliminar
  const handleEliminar = async () => {
    if (selectedUEs.length !== 1) {
      alert('Debes seleccionar exactamente una Unidad Educativa para eliminar.');
      return;
    }

    const ue = selectedUEs[0];
    const confirmacion = window.confirm(`⚠️ ¿Estás seguro de eliminar la: \n"${ue.nombre}"?`);

    if (!confirmacion) return;

    try {
      await api.delete(`/unidad-educativa/${ue.id}`);
      const nuevasUEs = unidadesEducativas.filter(item => item.id !== ue.id);
      setUnidadesEducativas(nuevasUEs);
      setSelectedUEs([]);
      alert(`✅ "${ue.nombre}" fue eliminada correctamente.`);
    } catch (error) {
      console.error(error);
      alert('❌ Error al eliminar.');
    }
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#f0f8ff',
        color: '#3498db',
        fontWeight: 'bold',
        fontSize: '14px',
        textAlign: 'center',
        paddingLeft: '0px',
        paddingRight: '0px',
        margin: 0,
      },
    },
    headRow: {
      style: {
        backgroundColor: '#eaf4fe',
        borderBottom: '1px solid #ccc',
        padding: 0,
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
            type="number"
            name="rue"
            value={form.rue !== null && form.rue !== undefined ? form.rue : ''}
            onChange={handleChange}
            placeholder="Ej: 30302014"
            min="0"
            max="99999999"
            className={`form-input ${
              errors.rue
                ? 'input-error'
                : Number.isInteger(form.rue) && form.rue !== null
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
            value={
              departamentos.find(dep => dep.id === form.departamento_id)
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
            value={
              municipios.find(mun => mun.id === form.municipio_id)
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
            setForm(initialForm);
            setErrors({});
            navigate(-1);
          }}
        >
          Cancelar
        </button>

        <button className="btn-guardar" onClick={handleSubmit}>
          {modoEdicion ? 'Actualizar' : 'Añadir'}
        </button>
      </div>

      <div className="tabla-ue-box">
        <h3 className="titulo-tabla-ue">Unidades Educativas Agregadas</h3>

        <DataTable
          columns={columns}
          data={unidadesEducativas}
          selectableRows
          selectableRowsSingle
          selectableRowsNoSelectAll
          onSelectedRowsChange={({ selectedRows }) => setSelectedUEs(selectedRows)}
          pagination={false}
          responsive
          fixedHeader
          fixedHeaderScrollHeight="300px"
          customStyles={customStyles}
        />

        <div className="form-buttons">
          <button className="btn-editar" onClick={handleEditar}>
            Editar
          </button>
          <button className="btn-eliminar" onClick={handleEliminar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearUE;
