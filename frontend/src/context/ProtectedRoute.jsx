import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, roles, loading } = useAuth();

  if (loading) return null; // O un loader

  // No autenticado
  if (!user) return <Navigate to="/login" />;

  // No tiene el rol permitido
  if (!roles.some((rol) => allowedRoles.includes(rol))) {
    return <Navigate to="/no-autorizado" />; // o <p>No autorizado</p>
  }

  return <Outlet />;
};

export default ProtectedRoute;
