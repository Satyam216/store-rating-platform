const express = require("express");
const router = express.Router();
const { signup, login, updatePassword } = require("../controllers/authController");
const { auth, requireRole } = require("../middlewares/auth");

// Signup (Normal user, Store owner, Admin depending on request.role)
router.post("/signup", signup);

// Login (All roles)
router.post("/login", login);

// Update password (only logged-in users)
router.post("/password", auth, updatePassword);

// Example: Route only for Admins (testing requireRole middleware)
router.get("/admin-only", auth, requireRole(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
});

// Test Route (for debugging API health)
router.get("/", (req, res) => {
  res.send("Auth API working");
});

module.exports = router;
