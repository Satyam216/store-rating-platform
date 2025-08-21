const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    console.log("Signup body:", req.body);

    // Name validation
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (name.length < 3 || name.length > 60) {
      return res
        .status(400)
        .json({ message: "Name must be between 3 and 60 characters" });
    }

    // Email validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Password validation
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!/^(?=.*[A-Z])(?=.*\W).{8,16}$/.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8–16 characters, include an uppercase & a special character",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || "user", // default role = user
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login body:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; 

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    // Password validation for new password
    if (!/^(?=.*[A-Z])(?=.*\W).{8,16}$/.test(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be 8–16 characters, include an uppercase & a special character",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update Password Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
