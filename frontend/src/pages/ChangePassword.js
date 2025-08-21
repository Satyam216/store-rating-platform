import React, { useState } from "react";
import api from "../services/api";

export default function ChangePassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/password", {
        oldPassword,
        newPassword,
      });
      setMsg(data && data.message ? data.message : "Password updated");
    } catch (err) {
      setMsg(
        (err && err.response && err.response.data && err.response.data.message) ||
          "Failed"
      );
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="back" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h2>Update Password</h2>
      </div>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <div>
            <label className="label">Old Password</label>
            <input
              className="input"
              type="password"
              value={oldPassword}
              onChange={(e) => setOld(e.target.value)}
            />
          </div>
          <div>
            <label className="label">New Password</label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">Save</button>
          {msg && <div className="badge">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
