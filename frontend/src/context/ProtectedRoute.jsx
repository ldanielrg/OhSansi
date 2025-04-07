import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, roles, loading } = useAuth();

  if (loading) return null; // O un loader

  // No autenticado
  if (!user) return <Navigate to="/login" />;

  const tienePermiso = roles.some((rol) => allowedRoles.includes(rol));

  if (!tienePermiso) return <Navigate to="/no-autorizado" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
