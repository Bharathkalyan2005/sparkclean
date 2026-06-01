import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('sucihome_token');
  
  if (!token) {
    return <Navigate to="/auth?redirect=/sparkadmin"/>;
  }

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    
    if (decoded.role !== 'ADMIN') {
      toast.error('Access denied. Admins only.');
      return <Navigate to="/"/>;
    }

    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem('sucihome_token');
      return <Navigate to="/auth?redirect=/sparkadmin"/>;
    }

    return <>{children}</>;

  } catch {
    return <Navigate to="/auth"/>;
  }
};

export default AdminRoute;