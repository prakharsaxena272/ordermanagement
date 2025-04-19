import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import WarehouseDashboard from './components/dashboard/WarehouseDashboard';
import DeliveryDashboard from './components/dashboard/DeliveryDashboard';
import './App.css';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const PrivateRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }

    const userRole = localStorage.getItem('role');
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to={`/dashboard/${userRole.toLowerCase()}`} />;
    }

    return children;
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard/customer"
            element={
              <PrivateRoute requiredRole="CUSTOMER">
                <CustomerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/warehouse_staff"
            element={
              <PrivateRoute requiredRole="WAREHOUSE_STAFF">
                <WarehouseDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/delivery_person"
            element={
              <PrivateRoute requiredRole="DELIVERY_PERSON">
                <DeliveryDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;