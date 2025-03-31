import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CrearEvento.css';
import RegistroForm from '../components/RegistroForm';

const CrearEvento = () => {
  // Estados para el cronograma
  const [cronograma, setCronograma] = useState({
    nombre: '',
    fechaInicio: '',
    fechaPreinscripcion: '',
    duracion: '',
    fechaFin: '',
    fechaInscripcion: '',
  });

  // Estados para la convocatoria
  const [presentacion, setPresentacion] = useState('');
  const [areas, setAreas] = useState([
    { 
      nombre: '', 
      inicioAno: '', 
      inicioNivel: '', 
      finalAno: '', 
      finalNivel: '' 
    },
  ]);
  const [requisitos, setRequisitos] = useState('');
  const [inscripcion, setInscripcion] = useState('');

  const navigate = useNavigate();

  // Agregar una nueva fila de área
  const handleAddArea = () => {
    setAreas([...areas, { nombre: '', inicioAno: '', inicioNivel: '', finalAno: '', finalNivel: '' }]);
  };

  // Actualizar datos de un área
  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas];
    newAreas[index][field] = value;
    setAreas(newAreas);
  };

  // Manejar el envío
  const handleSubmit = (e) => {
    e.preventDefault();
    const eventoData = {
      cronograma,
      convocatoria: {
        presentacion,
        areas,
        requisitos,
        inscripcion,
      },
    };
    console.log("Evento creado:", eventoData);
    // Aquí llamarías a tu API
    navigate('/eventos');
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        {/* Bloque: Cronograma */}
        <div className="caja-container">
          <div className="caja-header">Cronograma</div>
          <div className="caja-body">
            <div className="contenedor-cronograma-convocatoria">
              <section className="cont-form-cronograma">
                <RegistroForm 
                  label="Nombre del evento" 
                  value={cronograma.nombre}
                  onChange={(e) => setCronograma({ ...cronograma, nombre: e.target.value })}
                />
                <RegistroForm 
                  label="Fecha de inicio" 
                  type="date" 
                  value={cronograma.fechaInicio}
                  onChange={(e) => setCronograma({ ...cronograma, fechaInicio: e.target.value })}
                />
                <RegistroForm 
                  label="Fecha de Preinscripción" 
                  type="date" 
                  value={cronograma.fechaPreinscripcion}
                  onChange={(e) => setCronograma({ ...cronograma, fechaPreinscripcion: e.target.value })}
                />
              </section>
              <section className="cont-form-cronograma">
                <RegistroForm 
                  label="Duración (días)" 
                  value={cronograma.duracion}
                  onChange={(e) => setCronograma({ ...cronograma, duracion: e.target.value })}
                />
                <RegistroForm 
                  label="Fecha fin" 
                  type="date" 
                  value={cronograma.fechaFin}
                  onChange={(e) => setCronograma({ ...cronograma, fechaFin: e.target.value })}
                />
                <RegistroForm 
                  label="Fecha de Inscripción" 
                  type="date" 
                  value={cronograma.fechaInscripcion}
                  onChange={(e) => setCronograma({ ...cronograma, fechaInscripcion: e.target.value })}
                />
              </section>
            </div>
          </div>
        </div>

        {/* Bloque: Convocatoria */}
        <div className="caja-container">
          <div className="caja-header">Convocatoria</div>
          <div className="caja-body">
            {/* Presentación */}
            <h3>Presentación</h3>
            <textarea
              placeholder="Introduce la presentación..."
              value={presentacion}
              onChange={(e) => setPresentacion(e.target.value)}
              rows="4"
              style={{ width: '100%', marginBottom: '1rem' }}
            />

            {/* Áreas */}
            <h3>Áreas</h3>
            {areas.map((area, index) => (
              <div key={index} className="area-row">
                <div className="area-col">
                  <label>Nombre del Área</label>
                  <input
                    type="text"
                    value={area.nombre}
                    onChange={(e) => handleAreaChange(index, 'nombre', e.target.value)}
                    placeholder="Ej. Biología"
                  />
                </div>
                <div className="area-col-rango">
                  <label>Rango Inicial</label>
                  <div className="rango-agrupado">
                    <select
                      value={area.inicioAno}
                      onChange={(e) => handleAreaChange(index, 'inicioAno', e.target.value)}
                    >
                      <option value="">Año</option>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <select
                      value={area.inicioNivel}
                      onChange={(e) => handleAreaChange(index, 'inicioNivel', e.target.value)}
                    >
                      <option value="">Nivel</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                    </select>
                  </div>
                </div>
                <div className="area-col-rango">
                  <label>Rango Final</label>
                  <div className="rango-agrupado">
                    <select
                      value={area.finalAno}
                      onChange={(e) => handleAreaChange(index, 'finalAno', e.target.value)}
                    >
                      <option value="">Año</option>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <select
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
            <button 
              type="button" 
              className="nav-link" 
              onClick={handleAddArea}
              style={{ marginTop: '10px' }}
            >
              Agregar Área
            </button>

            {/* Requisitos */}
            <h3 style={{ marginTop: '1.5rem' }}>Requisitos</h3>
            <textarea
              placeholder={`Ejemplos:
• Ser estudiante de nivel primaria o secundaria en el sistema de Educación Regular.
• Ser postulante máximo en dos áreas de la Olimpiada.`}
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
              rows="4"
              style={{ width: '100%', marginBottom: '1rem' }}
            />

            {/* Inscripción */}
            <h3>Inscripción</h3>
            <textarea
              placeholder="Introduce los pasos a seguir para inscribirse..."
              value={inscripcion}
              onChange={(e) => setInscripcion(e.target.value)}
              rows="3"
              style={{ width: '100%', marginBottom: '1rem' }}
            />
          </div>
        </div>

        {/* Botón para enviar el formulario */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button type="submit" className="nav-link">Guardar Evento</button>
        </div>
      </form>
    </div>
  );
};

export default CrearEvento;
