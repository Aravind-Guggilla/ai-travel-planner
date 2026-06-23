import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../services/cookies';

const ProtectedRoute = () => {
  const token = getCookie('token');

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
