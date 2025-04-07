import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../styles/CrearUE.css'; // estilos específicos del formulario

const CrearUE = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    rue: '',
    departamento_id: '',
    municipio_id: ''
  });

  const [errors, setErrors] = useState({});
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data));
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
      newErrors.nombre = 'Después de "Unidad Educativa", Debe Ingresar el nombre de la Unidad Educativa. Máximo 100 caracteres.';
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

    try {
      const res = await fetch('http://localhost:8000/api/unidad-educativa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 409) {
        alert('⚠️ El RUE ingresado ya existe.');
      } else if (res.ok) {
        alert('✅ Unidad Educativa creada con éxito.');
        setForm({ nombre: '', rue: '', departamento_id: '', municipio_id: '' });
        setMunicipios([]);
        setErrors({});
      } else if (res.status === 422) {
        setErrors(data.errors || {});
      } else {
        alert(data.message || 'Ocurrió un error al registrar la Unidad Educativa.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="crear-ue-container">
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
        <div className="form-group">
          <label>Departamento</label>
          <Select
            className="react-select"
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
            className="react-select"
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
            setForm({ nombre: '', rue: '', departamento_id: '', municipio_id: '' });
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
    </div>
  );
};

export default CrearUE;
