import { useEffect, useState } from 'react';
import Select from 'react-select';
import '../styles/CrearUE.css';

const CrearUE = () => {
  const [form, setForm] = useState({
    nombre: '',
    rue: '',
    departamento_id: '',
    municipio_id: ''
  });

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

  const handleSubmit = async () => {
    // Validación rápida en el frontend
    if (!form.nombre || !form.rue || !form.departamento_id || !form.municipio_id) {
      alert('Por favor, completa todos los campos antes de continuar.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/unidad-educativa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 409) {
        //  RUE duplicado
        alert('⚠️ El RUE ingresado ya está registrado en la base de datos.\nPor favor verifica que el colegio no esté duplicado.');
      } else if (res.ok) {
        alert('✅ Unidad Educativa creada con éxito.');
        setForm({ nombre: '', rue: '', departamento_id: '', municipio_id: '' });
        setMunicipios([]);
      } else {
        alert(data.message || 'Ocurrió un error al registrar la Unidad Educativa.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor');
    }
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#e6f4ff',
      borderColor: '#a0c8f0',
      borderRadius: 999,
      paddingLeft: 10,
      fontSize: 16,
      minHeight: 42,
      boxShadow: 'none',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 10,
      border: '1px solid #3498db',
      zIndex: 100
    })
  };

  return (
    <div className="crear-ue-container">
      <div className="titulo-box">Crear Unidad Educativa</div>

      <div className="form-row">
        <div className="form-group ancho-input">
          <label>Nombre de Unidad Educativa</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="form-group ancho-input">
          <label>RUE</label>
          <input
            type="text"
            name="rue"
            value={form.rue}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group ancho-input">
          <label>Departamento</label>
          <Select
            className="select-react"
            styles={customSelectStyles}
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
        </div>

        <div className="form-group ancho-input">
          <label>Municipio</label>
          <Select
            className="select-react"
            styles={customSelectStyles}
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
        </div>
      </div>

      <div className="crear-ue-botones">
        <button className="btn-cancelar" onClick={() => setForm({ nombre: '', rue: '', departamento_id: '', municipio_id: '' })}>
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
