import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import RoleGate from "./components/RoleGate";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserStores from "./pages/UserStores";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

function Nav() {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {
    user = {};
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <div className="row" style={{ gap: 16 }}>
          <Link to="/" className="badge">Store Rating</Link>
          {user.role === "System Administrator" && (
            <>
              <Link to="/admin" className="badge">Admin Dashboard</Link>
              <Link to="/admin/users" className="badge">Users</Link>
              <Link to="/admin/stores" className="badge">Stores</Link>
            </>
          )}
          {user.role === "Store Owner" && (
            <Link to="/owner" className="badge">Owner</Link>
          )}
          {(user.role === "Normal User" || !user.role) && (
            <Link to="/stores" className="badge">Stores</Link>
          )}
        </div>
        <div className="row" style={{ gap: 8 }}>
          {user.email ? (
            <>
              <span className="badge">{user.email} ({user.role})</span>
              <Link to="/password" className="btn btn-outline">Change Password</Link>
              <button className="btn btn-danger" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/stores" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Normal User */}
        <Route
          path="/stores"
          element={
            <PrivateRoute>
              <RoleGate allow={["Normal User", "System Administrator", "Store Owner"]}>
                <UserStores />
              </RoleGate>
            </PrivateRoute>
          }
        />

        <Route
          path="/password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleGate allow={["System Administrator"]}>
                <AdminDashboard />
              </RoleGate>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <RoleGate allow={["System Administrator"]}>
                <AdminUsers />
              </RoleGate>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <PrivateRoute>
              <RoleGate allow={["System Administrator"]}>
                <AdminStores />
              </RoleGate>
            </PrivateRoute>
          }
        />

        {/* Store Owner */}
        <Route
          path="/owner"
          element={
            <PrivateRoute>
              <RoleGate allow={["Store Owner"]}>
                <OwnerDashboard />
              </RoleGate>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
