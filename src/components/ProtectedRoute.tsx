import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEstablishment } from '../context/EstablishmentContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { settings } = useEstablishment();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if onboarding is needed
  // If not setup completed AND we are not already on the onboarding page
  if (settings.isSetupCompleted === false && location.pathname !== '/app/onboarding') {
    return <Navigate to="/app/onboarding" replace />;
  }
  
  // If setup IS completed but we try to go to onboarding, redirect to dashboard
  if (settings.isSetupCompleted === true && location.pathname === '/app/onboarding') {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
