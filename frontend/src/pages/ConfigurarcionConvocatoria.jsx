import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';

const FormularioConvocatoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id_convocatoria: 0,
    nombre_convocatoria: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_final: '',
    activo: true,
  });

  useEffect(() => {
    if (id) fetchConvocatoria(id);
  }, [id]);

  const fetchConvocatoria = async (id) => {
    try {
      const { data } = await api.get(`/convocatoria-detalle/${id}`);
      setForm({
        id_convocatoria: data[0].id_convocatoria,
        nombre_convocatoria: data[0].nombre_convocatoria,
        descripcion: data[0].descripcion,
        fecha_inicio: data[0].fecha_inicio.slice(0,10),
        fecha_final: data[0].fecha_final.slice(0,10),
        activo: data[0].activo,
      });
    } catch (error) {
      toast.error('Error al obtener datos.');
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/convocatoria-editar/${id}`, form);
        navigate('/configuracion-convocatoria', { state: { message: 'Convocatoria editada con éxito.', type: 'success' } });
      } else {
        await api.post('/convocatoria-guardar', { ...form, id_convocatoria: 0 });
        navigate('/configuracion-convocatoria', { state: { message: 'Convocatoria creada con éxito.', type: 'success' } });
      }
    } catch (error) {
      toast.error('Error al guardar convocatoria.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-convocatoria">
      <h3>{id ? 'Editar' : 'Crear'} Convocatoria</h3>

      <input name="nombre_convocatoria" placeholder="Nombre" value={form.nombre_convocatoria} onChange={handleChange} required />
      <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange}></textarea>
      <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} required />
      <input type="date" name="fecha_final" value={form.fecha_final} onChange={handleChange} required />

      <select name="activo" value={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.value === 'true' })}>
        <option value={true}>Activo</option>
        <option value={false}>Inactivo</option>
      </select>

      <button className="btn-primary" type="submit">{id ? 'Actualizar' : 'Crear'}</button>
      <button className="btn-primary" type="button" onClick={() => navigate('/configuracion-convocatoria')}>Cancelar</button>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </form>
  );
};

export default FormularioConvocatoria;
