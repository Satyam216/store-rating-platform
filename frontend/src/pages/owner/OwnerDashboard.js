import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
    const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/owner/stats");
        setData(data);
      } catch (err) {
        setMsg("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
        <h2>Store Owner Dashboard</h2>
      </div>

      {loading && <div className="card">Loading...</div>}
      {msg && <div className="badge">{msg}</div>}

      {!loading && data.map(block => (
        <div className="card" key={block.store.id} style={{ marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
            <h3>{block.store.name}</h3>
            <span className="badge">Average: {block.average}</span>
          </div>
          <table className="table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {block.raters.map(r => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.rating}</td>
                </tr>
              ))}
              {block.raters.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: "center" }}>No ratings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {!loading && data.length === 0 && (
        <div className="card">No stores assigned yet.</div>
      )}
    </div>
  );
}
