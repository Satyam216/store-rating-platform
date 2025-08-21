import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container">
      <div className="header">
        {/* ✅ Fixed: only one Back button */}
        <button className="back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Admin Dashboard</h2>
      </div>
      <div className="kpi">
        <div className="stat">
          <div className="n">{stats.totalUsers}</div>
          <div className="label">Users</div>
        </div>
        <div className="stat">
          <div className="n">{stats.totalStores}</div>
          <div className="label">Stores</div>
        </div>
        <div className="stat">
          <div className="n">{stats.totalRatings}</div>
          <div className="label">Ratings</div>
        </div>
      </div>
    </div>
  );
}
