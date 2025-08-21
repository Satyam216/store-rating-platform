import React from "react";

export default function RoleGate({ children, allow = [] }) {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {
    user = {};
  }

  if (!allow.length || allow.includes(user.role)) {
    return children;
  }

  return (
    <div className="container">
      <div className="card">Forbidden</div>
    </div>
  );
}
