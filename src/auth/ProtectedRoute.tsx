import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to='/' replace />;
  }

  return children;
};
