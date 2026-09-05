import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const hasToken = !!localStorage.getItem('token');

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
