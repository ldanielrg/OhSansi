import api from '../api/axios';

//Función para iniciar sesión
export async function login(email, password) {
  try {
    const response = await api.post('/login', {
      email,
      password,
    });

    const { access_token, user, roles } = response.data;

    // Guardar en localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('roles', JSON.stringify(roles));

    // Configurar Axios con el token globalmente
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return { success: true, user, roles };
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al iniciar sesión';
    return { success: false, message: mensaje };
  }
}

//Función para cerrar sesión
export async function logout() {
  try {
    await api.post('/logout');
  } catch (e) {
    // Ignoramos si el token ya estaba inválido
  }

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('roles');
  delete api.defaults.headers.common['Authorization'];
}
