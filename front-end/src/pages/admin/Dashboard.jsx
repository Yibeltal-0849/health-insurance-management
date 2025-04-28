import React, { useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import AdminSidebar from "../../components/admin/Sidebar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <header className="admin-header">
          <h2>Admin Dashboard</h2>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
