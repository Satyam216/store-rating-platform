import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // ✅ Role state add
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (name.length < 3 || name.length > 60) {
      return "Name must be 20–60 characters.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Enter a valid email.";
    }
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passRegex.test(password)) {
      return "Password must be 8–16 chars, 1 uppercase, 1 special char.";
    }
    if (address.length > 400) {
      return "Address must be max 400 characters.";
    }
    if (!role) {
      return "Please select a role.";
    }
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    const validationError = validateForm();
    if (validationError) {
      setMsg(validationError);
      return;
    }

    try {
      const { data } = await api.post("/auth/signup", {
        name,
        email,
        address,
        password,
        role, // ✅ Send role also
      });
      setMsg(data?.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      setMsg(
        err?.response?.data?.message || "Signup failed, please try again."
      );
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Sign up</h2>
      </div>
      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <div>
            <label className="label">Name (20–60)</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-2">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                Password (8–16, 1 Uppercase, 1 Special)
              </label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Address (max 400)</label>
            <textarea
              className="input"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* ✅ Role dropdown */}
          <div>
            <label className="label">Role</label>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              <option value="System Administrator">System Administrator</option>
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
            </select>
          </div>

          <button className="btn btn-primary">Create account</button>
          {msg && <div className="badge">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
