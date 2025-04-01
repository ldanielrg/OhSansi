// EventoForm.jsx
import React, { useState, useEffect } from 'react';
import '../styles/EventoForm.css';

function EventoForm({ mode, initialData, onSubmit, onCancel }) {
  // Estados para cronograma
  const [cronograma, setCronograma] = useState({
    nombre: '',
    fechaInicio: '',
    fechaPreinscripcion: '',
    duracion: '',
    fechaFin: '',
    fechaInscripcion: '',
  });

  // Estados para convocatoria
  const [presentacion, setPresentacion] = useState('');
  const [areas, setAreas] = useState([
    { nombre: '', inicioAno: '', inicioNivel: '', finalAno: '', finalNivel: '' },
  ]);
  const [requisitos, setRequisitos] = useState('');
  const [inscripcion, setInscripcion] = useState('');

  // Al montar o cuando cambie initialData, cargamos los datos en el estado (para editar o ver).
  useEffect(() => {
    if (initialData) {
      setCronograma(initialData.cronograma || {});
      setPresentacion(initialData.convocatoria?.presentacion || '');
      setAreas(initialData.convocatoria?.areas || []);
      setRequisitos(initialData.convocatoria?.requisitos || '');
      setInscripcion(initialData.convocatoria?.inscripcion || '');
    }
  }, [initialData]);

  // Función para agregar un bloque "Área"
  const handleAddArea = () => {
    setAreas([
      ...areas,
      { nombre: '', inicioAno: '', inicioNivel: '', finalAno: '', finalNivel: '' },
    ]);
  };

  // Manejo de cambios en las áreas
  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas];
    newAreas[index][field] = value;
    setAreas(newAreas);
  };

  // Enviar formulario (solo se hace en modo "create" o "edit")
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'view') return; // En modo ver no hacemos nada

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

  // Verificamos si estamos en modo "view" para deshabilitar inputs
  const isViewMode = (mode === 'view');

  return (
    <form onSubmit={handleSubmit}>
      {/* Bloque: Cronograma */}
      <div className="cronograma-container">
        <div className="cronograma-header">Cronograma</div>
        <div className="cronograma-body">
          <div className="contenedor-cronograma">
            {/* Columna 1 */}
            <section className="form-col">
              <div className="registro-form-field">
                <label className="nombre-registro">Nombre del evento</label>
                <input
                  type="text"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.nombre}
                  onChange={(e) =>
                    setCronograma({ ...cronograma, nombre: e.target.value })
                  }
                />
              </div>

              <div className="registro-form-field">
                <label className="nombre-registro">Fecha de inicio</label>
                <input
                  type="date"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.fechaInicio}
                  onChange={(e) =>
                    setCronograma({ ...cronograma, fechaInicio: e.target.value })
                  }
                />
              </div>

              <div className="registro-form-field">
                <label className="nombre-registro">Fecha de Preinscripción</label>
                <input
                  type="date"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.fechaPreinscripcion}
                  onChange={(e) =>
                    setCronograma({ ...cronograma, fechaPreinscripcion: e.target.value })
                  }
                />
              </div>
            </section>

            {/* Columna 2 */}
            <section className="form-col">
              <div className="registro-form-field">
                <label className="nombre-registro">Duración (días)</label>
                <input
                  type="number"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.duracion}
                  onChange={(e) =>
                    setCronograma({ ...cronograma, duracion: e.target.value })
                  }
                />
              </div>

              <div className="registro-form-field">
                <label className="nombre-registro">Fecha fin</label>
                <input
                  type="date"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.fechaFin}
                  onChange={(e) =>
                    setCronograma({ ...cronograma, fechaFin: e.target.value })
                  }
                />
              </div>

              <div className="registro-form-field">
                <label className="nombre-registro">Fecha de Inscripción</label>
                <input
                  type="date"
                  className="input-registro"
                  disabled={isViewMode}
                  value={cronograma.fechaInscripcion}
                  onChange={(e) =>
                    setCronograma({ ...cronograma, fechaInscripcion: e.target.value })
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Bloque: Convocatoria */}
      <div className="convocatoria-container">
        <div className="convocatoria-header">Convocatoria</div>
        <div className="convocatoria-body">
          {/* Presentación */}
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

          {/* Áreas */}
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
                    {[1, 2, 3, 4, 5, 6].map(num => (
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
                    {[1, 2, 3, 4, 5, 6].map(num => (
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
          {/* Solo mostramos botón "Agregar Área" si no es modo 'view' */}
          {(!isViewMode) && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleAddArea}
              style={{ marginTop: '0.8rem' }}
            >
              Agregar Área
            </button>
          )}

          {/* Requisitos */}
          <h3 style={{ marginTop: '1.5rem' }}>Requisitos</h3>
          <div className="registro-form-field">
            <textarea
              className="input-registro"
              rows="4"
              placeholder={`Ejemplos:
• Ser estudiante de nivel primaria o secundaria...
• Ser postulante máximo en dos áreas...`}
              disabled={isViewMode}
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
            />
          </div>

          {/* Inscripción */}
          <h3>Inscripción</h3>
          <div className="registro-form-field">
            <textarea
              className="input-registro"
              rows="3"
              placeholder="Introduce los pasos a seguir para inscribirse..."
              disabled={isViewMode}
              value={inscripcion}
              onChange={(e) => setInscripcion(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Botones finales */}
      <div className="eventoform-footer">
        {/* Botón "Guardar" aparece solo si estamos en modo crear o editar */}
        {(mode === 'create' || mode === 'edit') && (
          <button type="submit" className="btn-primary" style={{ marginRight: '1rem' }}>
            Guardar
          </button>
        )}
        {/* Botón Salir (onCancel) */}
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Salir
        </button>
      </div>
    </form>
  );
}

export default EventoForm;
