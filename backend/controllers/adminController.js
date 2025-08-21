const { Op, fn, col, literal } = require("sequelize");
const { User, Store, Rating } = require("../models");
const bcrypt = require("bcryptjs");

exports.dashboardCounts = async (req, res) => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();
  res.json({ totalUsers, totalStores, totalRatings });
};

// Add users (admin can add admin or normal, and store owners)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || name.length < 3 || name.length > 60) return res.status(400).json({ message: "Name 20–60 chars" });
    if (!email) return res.status(400).json({ message: "Email required" });
    if (address && address.length > 400) return res.status(400).json({ message: "Address max 400 chars" });
    const PASS_REGEX = /^(?=.*[A-Z])(?=.*\W).{8,16}$/;
    if (!PASS_REGEX.test(password)) return res.status(400).json({ message: "Password invalid" });
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) return res.status(400).json({ message: "Invalid email" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role });
    res.status(201).json({ message: "User created", user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.listUsers = async (req, res) => {
  const { q = "", role, sortBy = "name", order = "ASC" } = req.query;
  const where = {
    [Op.or]: [
      { name: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } },
      { address: { [Op.like]: `%${q}%` } },
    ],
  };
  if (role) where.role = role;

  const users = await User.findAll({
    where,
    order: [[sortBy, order]],
    attributes: ["id", "name", "email", "address", "role"]
  });

  res.json(users);
};

exports.userDetails = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id, { attributes: ["id", "name", "email", "address", "role"] });
  if (!user) return res.status(404).json({ message: "User not found" });

  let ownerRating = null;
  if (user.role === "Store Owner") {
    // average rating of his store(s)
    const stores = await Store.findAll({ where: { owner_id: user.id }, attributes: ["id"] });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length) {
      const avg = await Rating.findOne({
        attributes: [[fn("AVG", col("rating")), "avgRating"]],
        where: { store_id: storeIds }
      });
      ownerRating = Number(avg?.get("avgRating") || 0).toFixed(2);
    } else {
      ownerRating = "0.00";
    }
  }

  res.json({ ...user.toJSON(), ownerRating });
};

exports.addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    if (!name) return res.status(400).json({ message: "Store name required" });
    if (!email) return res.status(400).json({ message: "Store email required" });
    if (!address || address.length > 400) return res.status(400).json({ message: "Address max 400 chars" });

    const store = await Store.create({ name, email, address, owner_id: owner_id || null });
    res.status(201).json({ message: "Store created", store });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.listStores = async (req, res) => {
  const { q = "", sortBy = "name", order = "ASC" } = req.query;
  const stores = await Store.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { address: { [Op.like]: `%${q}%` } },
      ]
    },
    order: [[sortBy, order]],
  });

  // attach average rating
  const storeIds = stores.map(s => s.id);
  let ratingsMap = {};
  if (storeIds.length) {
    const rows = await Rating.findAll({
      attributes: ["store_id", [fn("AVG", col("rating")), "avgRating"]],
      where: { store_id: storeIds },
      group: ["store_id"]
    });
    ratingsMap = rows.reduce((acc, r) => {
      acc[r.store_id] = Number(r.get("avgRating")).toFixed(2);
      return acc;
    }, {});
  }

  const data = stores.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    address: s.address,
    rating: ratingsMap[s.id] || "0.00"
  }));

  res.json(data);
};
