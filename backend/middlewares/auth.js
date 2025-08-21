const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.requireRole = (roles = []) => (req, res, next) => {
  if (!roles.length) return next();
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
