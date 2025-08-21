import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // 👈 yeh import add karo
import api from "../../services/api";

export default function AdminStores() {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", address: "", owner_id: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const fetchStores = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/admin/stores?q=${encodeURIComponent(q)}&sortBy=${sortBy}&order=${order}`
      );
      setRows(data);
    } catch (err) {
      setMsg("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
  }, [q, sortBy, order]);

  const addStore = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, owner_id: form.owner_id ? Number(form.owner_id) : null };
      const { data } = await api.post("/admin/stores", payload);
      setMsg(data.message || "Store added successfully");
      setForm({ name: "", email: "", address: "", owner_id: "" });
      fetchStores();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to add store");
    }
  };

  const flipOrder = () => setOrder(order === "ASC" ? "DESC" : "ASC");

  return (
    <div className="container">
      <div className="header">
        {/* 👇 history.back() hata ke navigate(-1) use karo */}
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
        <h2>Manage Stores</h2>
      </div>

      {/* Add Store Form */}
      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={addStore} className="grid grid-3">
          <div>
            <label className="label">Store Name</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Store Email</label>
            <input
              className="input"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Owner User ID (optional)</label>
            <input
              className="input"
              type="number"
              value={form.owner_id}
              onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
            />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
            <div>
              <label className="label">Address</label>
              <input
                className="input"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">&nbsp;</label>
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={!form.name || !form.email || !form.address}
            >
              Add Store
            </button>
          </div>
        </form>
        {msg && <div className="badge" style={{ marginTop: 8 }}>{msg}</div>}
      </div>

      {/* Store List */}
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <div className="row" style={{ gap: 8 }}>
            <input
              className="input"
              placeholder="Search Name/Email/Address"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="row" style={{ gap: 8 }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
            </select>
            <button className="btn btn-outline" onClick={flipOrder}>
              Order: {order}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 12 }}>Loading stores...</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td><b>{s.rating}</b></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: "center" }}>No stores found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
