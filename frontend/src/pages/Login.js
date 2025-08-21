import React, { useState } from "react";
import api from "../services/api";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMsg("Login successful");
      window.location.href = "/";
    } catch (err) {
      setMsg(
        (err && err.response && err.response.data && err.response.data.message) ||
          "Login failed"
      );
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Header */}
      <div>
        <div className="header">
          <button className="back" onClick={() => window.history.back()}>
            ← Back
          </button>
          <h2>Login</h2>
        </div>
        <div className="card" style={{ maxWidth: 500, margin: "auto" }}>
          <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary">Login</button>
            {msg && <div className="badge">{msg}</div>}
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "20px 0" }}>
        <p>© {new Date().getFullYear()} Made by Satyam Jain-(24MCA10015). All Rights Reserved.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px" }}>
          <a href="https://github.com/Satyam216" target="_blank" rel="noopener noreferrer">
            <FaGithub size={28} />
          </a>
          <a href="https://www.linkedin.com/in/satyam-jain-874b66143" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={28} color="#0A66C2" />
          </a>
        </div>
      </footer>
    </div>
  );
}
