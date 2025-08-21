import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "Normal User",
  });
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await api.get(
        `/admin/users?q=${encodeURIComponent(q)}&role=${encodeURIComponent(
          role
        )}&sortBy=${sortBy}&order=${order}`
      );
      setRows(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, role, sortBy, order]);

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/users", form);
      setMsg(data.message);
      setForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "Normal User",
      });
      fetchUsers();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed");
    }
  };

  const flipOrder = () => setOrder(order === "ASC" ? "DESC" : "ASC");

  return (
    <div className="container">
      <div className="header">
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
        <h2>Manage Users</h2>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={addUser} className="grid grid-3">
          <div>
            <label className="label">Name (20–60)</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <div>
              <label className="label">Address</label>
              <input
                className="input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select
                className="input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>System Administrator</option>
                <option>Normal User</option>
                <option>Store Owner</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">&nbsp;</label>
            <button className="btn btn-primary" style={{ width: "100%" }}>
              Add User
            </button>
          </div>
        </form>
        {msg && <div className="badge" style={{ marginTop: 8 }}>{msg}</div>}
      </div>

      <div className="card">
        <div
          className="row"
          style={{ justifyContent: "space-between", marginBottom: 12 }}
        >
          <div className="row" style={{ gap: 8 }}>
            <input
              className="input"
              placeholder="Search Name/Email/Address"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option>System Administrator</option>
              <option>Normal User</option>
              <option>Store Owner</option>
            </select>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="role">Role</option>
            </select>
            <button className="btn btn-outline" onClick={flipOrder}>
              Order: {order}
            </button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>
                  <span className="badge">{u.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
