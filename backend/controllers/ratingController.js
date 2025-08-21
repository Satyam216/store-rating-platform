const { Rating } = require("../models");
const { Op, fn, col } = require("sequelize");

exports.upsertRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    if (!store_id) return res.status(400).json({ message: "store_id required" });
    const val = Number(rating);
    if (!(val >= 1 && val <= 5)) return res.status(400).json({ message: "Rating must be 1–5" });

    const existing = await Rating.findOne({ where: { user_id: req.user.id, store_id } });
    if (existing) {
      existing.rating = val;
      await existing.save();
      return res.json({ message: "Rating updated", rating: existing });
    }
    const created = await Rating.create({ user_id: req.user.id, store_id, rating: val });
    res.status(201).json({ message: "Rating submitted", rating: created });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMyRatings = async (req, res) => {
  const rows = await Rating.findAll({ where: { user_id: req.user.id } });
  res.json(rows);
};
