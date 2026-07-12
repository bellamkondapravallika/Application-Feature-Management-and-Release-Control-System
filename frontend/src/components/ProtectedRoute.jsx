import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return !token ? children : <Navigate to="/dashboard" replace />;
};
