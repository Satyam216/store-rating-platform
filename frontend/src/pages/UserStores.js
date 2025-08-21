import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const [myRatings, setMyRatings] = useState({}); // storeId -> rating
  const [msg, setMsg] = useState("");

  const fetchStores = async () => {
    try {
      const { data } = await api.get(
        `/stores?q=${encodeURIComponent(q)}&sortBy=${sortBy}&order=${order}`
      );
      setStores(data);
    } catch (err) {
      setMsg("Failed to fetch stores");
    }
  };

  const fetchMyRatings = async () => {
    try {
      const { data } = await api.get("/ratings/me");
      const map = {};
      data.forEach((r) => {
        map[r.store_id] = r.rating;
      });
      setMyRatings(map);
    } catch (err) {
      setMsg("Failed to fetch ratings");
    }
  };

  useEffect(() => {
    fetchStores();
    fetchMyRatings();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
  }, [q, sortBy, order]);

  const submitRating = async (store_id, val) => {
    try {
      const { data } = await api.post("/ratings", { store_id, rating: val });
      setMsg(data && data.message ? data.message : "Rating saved");
      await fetchMyRatings();
      await fetchStores();
    } catch (err) {
      setMsg(
        (err &&
          err.response &&
          err.response.data &&
          err.response.data.message) ||
          "Failed"
      );
    }
  };

  const flipOrder = () => setOrder(order === "ASC" ? "DESC" : "ASC");

  return (
    <div className="container">
      <div className="header">
        <button className="back" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h2>All Stores</h2>
      </div>
      <div className="card">
        <div
          className="row"
          style={{ justifyContent: "space-between", marginBottom: 12 }}
        >
          <div className="search">
            <input
              className="input"
              placeholder="Search name/email/address"
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

        <table className="table">
          <thead>
            <tr>
              <th>Store</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>My Rating</th>
              <th>Rate / Edit</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>
                  {s.name} <div className="badge">{s.email}</div>
                </td>
                <td>{s.address}</td>
                <td>
                  <b>{s.rating}</b>
                </td>
                <td>{myRatings[s.id] ?? "-"}</td>
                <td>
                  <div className="row">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <span
                        key={v}
                        className="rating-star"
                        onClick={() => submitRating(s.id, v)}
                      >
                        {(myRatings[s.id] || 0) >= v ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {msg && (
          <div style={{ marginTop: 10 }} className="badge">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
