const { Rating, Store, User, fn, col } = require("../models").sequelize
  ? require("../models")
  : { Rating: null, Store: null, User: null }; // safety

const { Rating: RatingModel, Store: StoreModel, User: UserModel } = require("../models");

exports.myStoreStats = async (req, res) => {
  // store owner can have multiple stores; return list with avg & raters
  const stores = await StoreModel.findAll({ where: { owner_id: req.user.id } });
  const result = [];
  for (const store of stores) {
    const avg = await RatingModel.findOne({
      attributes: [[fn("AVG", col("rating")), "avgRating"]],
      where: { store_id: store.id }
    });
    const raters = await RatingModel.findAll({
      where: { store_id: store.id },
      include: [{ model: UserModel, attributes: ["id", "name", "email"] }]
    });
    result.push({
      store: { id: store.id, name: store.name },
      average: Number(avg?.get("avgRating") || 0).toFixed(2),
      raters: raters.map(r => ({ id: r.User.id, name: r.User.name, email: r.User.email, rating: r.rating }))
    });
  }
  res.json(result);
};
