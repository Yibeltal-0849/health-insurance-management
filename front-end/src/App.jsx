import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import HospitalDashboard from "./pages/hospital/Dashboard";
import ManagerDashboard from "./pages/manager/Dashboard";
import CustomerDashboard from "./pages/customer/Dashboard";
import KebeleDashboard from "./pages/kebele/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin/*"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/hospital/*"
              element={
                <PrivateRoute roles={["hospital"]}>
                  <HospitalDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/manager/*"
              element={
                <PrivateRoute roles={["manager"]}>
                  <ManagerDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/customer/*"
              element={
                <PrivateRoute roles={["customer"]}>
                  <CustomerDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/kebele/*"
              element={
                <PrivateRoute roles={["kebele"]}>
                  <KebeleDashboard />
                </PrivateRoute>
              }
            />

            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
