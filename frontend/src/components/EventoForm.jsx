// src/components/EventoForm.jsx
import React, { useState, useEffect } from 'react';
import '../styles/EventoForm.css';

function EventoForm({ mode, initialData, onSubmit, onCancel }) {
  const [cronograma, setCronograma] = useState({
    nombre: '',
    fechaInicio: '',
    fechaPreinscripcion: '',
    duracion: '',
    fechaFin: '',
    fechaInscripcion: '',
  });

  const [presentacion, setPresentacion] = useState('');
  const [areas, setAreas] = useState([
    { nombre: '', inicioAno: '', inicioNivel: '', finalAno: '', finalNivel: '' },
  ]);
  const [requisitos, setRequisitos] = useState('');
  const [inscripcion, setInscripcion] = useState('');

  // Para manejar errores de validación
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setCronograma(initialData.cronograma || {});
      setPresentacion(initialData.convocatoria?.presentacion || '');
      setAreas(initialData.convocatoria?.areas || []);
      setRequisitos(initialData.convocatoria?.requisitos || '');
      setInscripcion(initialData.convocatoria?.inscripcion || '');
    }
  }, [initialData]);

  const isViewMode = (mode === 'view');
  const isEditOrCreate = (mode === 'edit' || mode === 'create');

  // Validaciones
  const validate = () => {
    let validationErrors = [];

    // 1. Campos obligatorios en cronograma
    if (!cronograma.nombre.trim()) {
      validationErrors.push('El nombre del evento es obligatorio.');
    }
    if (!cronograma.fechaInicio) {
      validationErrors.push('La fecha de inicio es obligatoria.');
    }
    if (!cronograma.fechaFin) {
      validationErrors.push('La fecha fin es obligatoria.');
    }
    // Comprobar coherencia: fechaInicio <= fechaFin
    if (cronograma.fechaInicio && cronograma.fechaFin) {
      if (cronograma.fechaInicio > cronograma.fechaFin) {
        validationErrors.push('La fecha de inicio no puede ser mayor que la fecha fin.');
      }
    }

    // 2. Presentación obligatoria
    if (!presentacion.trim()) {
      validationErrors.push('La presentación de la convocatoria es obligatoria.');
    }

    // 3. Validar áreas: que tengan nombre
    areas.forEach((area, idx) => {
      if (!area.nombre.trim()) {
        validationErrors.push(`El área #${idx + 1} necesita un nombre.`);
      }
    });

    // 4. Validar otros campos obligatorios si deseas (requisitos, inscripcion, etc.)
    // Ejemplo:
    if (!requisitos.trim()) {
      validationErrors.push('Los requisitos son obligatorios.');
    }
    if (!inscripcion.trim()) {
      validationErrors.push('La sección de inscripción es obligatoria.');
    }

    setErrors(validationErrors);
    return validationErrors.length === 0; // true si no hay errores
  };

  // Manejar submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'view') return;

    // Correr validaciones
    const isValid = validate();
    if (!isValid) return; // Si hay errores, no llamamos onSubmit

    const eventoData = {
      cronograma,
      convocatoria: {
        presentacion,
        areas,
        requisitos,
        inscripcion,
      },
    };
    onSubmit(eventoData);
  };

  // Agregar un área
  const handleAddArea = () => {
    setAreas([...areas, { nombre: '', inicioAno: '', inicioNivel: '', finalAno: '', finalNivel: '' }]);
  };

  // Cambiar valores en un área
  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas];
    newAreas[index][field] = value;
    setAreas(newAreas);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Mensajes de error */}
      {errors.length > 0 && (
        <div className="error-panel">
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bloque CRONOGRAMA */}
      <div className="cronograma-container">
        <div className="cronograma-header">Cronograma</div>
        <div className="cronograma-body">
          <div className="contenedor-cronograma">
            <section className="form-col">
              <div className="registro-form-field">
                <label className="nombre-registro">Nombre del evento</label>
                <input
                  type="text"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.nombre}
                  onChange={(e) => setCronograma({ ...cronograma, nombre: e.target.value })}
                />
              </div>

              <div className="registro-form-field">
                <label className="nombre-registro">Fecha de inicio</label>
                <input
                  type="date"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.fechaInicio}
                  onChange={(e) => setCronograma({ ...cronograma, fechaInicio: e.target.value })}
                />
              </div>

              <div className="registro-form-field">
                <label className="nombre-registro">Fecha de Preinscripción</label>
                <input
                  type="date"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.fechaPreinscripcion}
                  onChange={(e) => setCronograma({ ...cronograma, fechaPreinscripcion: e.target.value })}
                />
              </div>
            </section>

            <section className="form-col">
              <div className="registro-form-field">
                <label className="nombre-registro">Duración (días)</label>
                <input
                  type="number"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.duracion}
                  onChange={(e) => setCronograma({ ...cronograma, duracion: e.target.value })}
                />
              </div>

              <div className="registro-form-field">
                <label className="nombre-registro">Fecha fin</label>
                <input
                  type="date"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.fechaFin}
                  onChange={(e) => setCronograma({ ...cronograma, fechaFin: e.target.value })}
                />
              </div>

              <div className="registro-form-field">
                <label className="nombre-registro">Fecha de Inscripción</label>
                <input
                  type="date"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.fechaInscripcion}
                  onChange={(e) => setCronograma({ ...cronograma, fechaInscripcion: e.target.value })}
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Bloque CONVOCATORIA */}
      <div className="convocatoria-container">
        <div className="convocatoria-header">Convocatoria</div>
        <div className="convocatoria-body">
          <h3>Presentación</h3>
          <div className="registro-form-field">
            <textarea
              className="input-registro"
              rows="4"
              placeholder="Introduce la presentación..."
              disabled={isViewMode}
              value={presentacion}
              onChange={(e) => setPresentacion(e.target.value)}
            />
          </div>

          <h3>Áreas</h3>
          {areas.map((area, index) => (
            <div key={index} className="area-item">
              <div className="registro-form-field">
                <label className="nombre-registro">Nombre del Área</label>
                <input
                  type="text"
                  className="input-registro"
                  disabled={isViewMode}
                  placeholder="Ej. Biología"
                  value={area.nombre}
                  onChange={(e) => handleAreaChange(index, 'nombre', e.target.value)}
                />
              </div>
              {/* Rango inicial */}
              <div className="registro-form-field">
                <label className="nombre-registro">Rango Inicial</label>
                <div className="rango-grupo">
                  <select
                    className="input-registro"
                    disabled={isViewMode}
                    value={area.inicioAno}
                    onChange={(e) => handleAreaChange(index, 'inicioAno', e.target.value)}
                  >
                    <option value="">Año</option>
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <select
                    className="input-registro"
                    disabled={isViewMode}
                    value={area.inicioNivel}
                    onChange={(e) => handleAreaChange(index, 'inicioNivel', e.target.value)}
                  >
                    <option value="">Nivel</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                  </select>
                </div>
              </div>
              {/* Rango final */}
              <div className="registro-form-field">
                <label className="nombre-registro">Rango Final</label>
                <div className="rango-grupo">
                  <select
                    className="input-registro"
                    disabled={isViewMode}
                    value={area.finalAno}
                    onChange={(e) => handleAreaChange(index, 'finalAno', e.target.value)}
                  >
                    <option value="">Año</option>
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <select
                    className="input-registro"
                    disabled={isViewMode}
                    value={area.finalNivel}
                    onChange={(e) => handleAreaChange(index, 'finalNivel', e.target.value)}
                  >
                    <option value="">Nivel</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {!isViewMode && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleAddArea}
              style={{ marginTop: '0.8rem' }}
            >
              Agregar Área
            </button>
          )}

          <h3 style={{ marginTop: '1.5rem' }}>Requisitos</h3>
          <div className="registro-form-field">
            <textarea
              className="input-registro"
              rows="4"
              placeholder="Ejemplos de requisitos..."
              disabled={isViewMode}
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
            />
          </div>

          <h3>Inscripción</h3>
          <div className="registro-form-field">
            <textarea
              className="input-registro"
              rows="3"
              placeholder="Pasos para inscribirse..."
              disabled={isViewMode}
              value={inscripcion}
              onChange={(e) => setInscripcion(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Botones footer (Guardar y Salir) */}
      <div className="eventoform-footer">
        {isEditOrCreate && (
          <button type="submit" className="btn-primary" style={{ marginRight: '1rem' }}>
            Guardar
          </button>
        )}
        <button type="button" className="btn-primary" onClick={onCancel}>
          Salir
        </button>
      </div>
    </form>
  );
}

export default EventoForm;
