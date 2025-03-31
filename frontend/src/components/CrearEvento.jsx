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
  const [participantes, setParticipantes] = useState([{ materia: '', rango: '' }]);
  const [requisitos, setRequisitos] = useState('');
  const [inscripcion, setInscripcion] = useState('');

  const navigate = useNavigate();

  // Agregar una nueva fila para participante
  const handleAddParticipante = () => {
    setParticipantes([...participantes, { materia: '', rango: '' }]);
  };

  // Actualizar participante
  const handleParticipanteChange = (index, field, value) => {
    const newParticipantes = [...participantes];
    newParticipantes[index][field] = value;
    setParticipantes(newParticipantes);
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const eventoData = {
      cronograma,
      convocatoria: {
        presentacion,
        participantes,
        requisitos,
        inscripcion,
      },
    };
    console.log("Evento creado:", eventoData);
    // Aquí llamarías a tu API o almacenas en estado global
    navigate('/eventos');
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        {/* Sección de Cronograma */}
        <div className="evento-container">
          <div className="evento-header">Cronograma</div>
          <div className="evento-body">
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

        {/* Sección de Convocatoria */}
        <div className="evento-container">
          <div className="evento-header">Convocatoria</div>
          <div className="evento-body">
            {/* Presentación */}
            <h3>Presentación</h3>
            <textarea
              placeholder="Introduce la presentación..."
              value={presentacion}
              onChange={(e) => setPresentacion(e.target.value)}
              rows="4"
              style={{ width: "100%" }}
            ></textarea>

            {/* Participantes */}
            <h3>Participantes</h3>
            {participantes.map((part, index) => (
              <div key={index} className="participante-row">
                <input
                  type="text"
                  placeholder="Materia (ej. Biología)"
                  value={part.materia}
                  onChange={(e) => handleParticipanteChange(index, 'materia', e.target.value)}
                />
                <select
                  value={part.rango}
                  onChange={(e) => handleParticipanteChange(index, 'rango', e.target.value)}
                >
                  <option value="">Selecciona rango</option>
                  <option value="primaria_1_6">1ro a 6to de primaria</option>
                  <option value="secundaria_1_6">1ro a 6to de secundaria</option>
                  <option value="secundaria_2_6">2do a 6to de secundaria</option>
                  <option value="primaria5_secundaria6">5to de primaria a 6to de secundaria</option>
                </select>
              </div>
            ))}
            <button type="button" className="nav-link" onClick={handleAddParticipante}>Agregar Participante</button>

            {/* Requisitos */}
            <h3>Requisitos</h3>
            <textarea
              placeholder={`Ejemplos:
• Ser estudiante de nivel primaria o secundaria en el sistema de Educación Regular del Estado Plurinacional de Bolivia.
• Ser postulante máximo en dos áreas de la Olimpiada.`}
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
              rows="4"
              style={{ width: "100%" }}
            ></textarea>

            {/* Inscripción */}
            <h3>Inscripción</h3>
            <textarea
              placeholder="Introduce los pasos a seguir para inscribirse..."
              value={inscripcion}
              onChange={(e) => setInscripcion(e.target.value)}
              rows="3"
              style={{ width: "100%" }}
            ></textarea>
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
