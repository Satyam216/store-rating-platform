import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const nav = useNavigate();
  return (
    <button className="back" onClick={() => nav(-1)}>
      ← Back
    </button>
  );
}
