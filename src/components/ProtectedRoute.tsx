import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'EXECUTOR' | 'CUSTOMER' | 'CUSTMER')[]; // CUSTMER is database typo
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize CUSTMER to CUSTOMER for role checking
  const normalizedRole = user.ROLE === 'CUSTMER' ? 'CUSTOMER' : user.ROLE;
  if (allowedRoles && !allowedRoles.includes(normalizedRole as any)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
