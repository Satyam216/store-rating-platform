const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");

const Rating = sequelize.define("Rating", {
  value: { type: DataTypes.INTEGER, allowNull: false },
});

Rating.belongsTo(User);
Rating.belongsTo(Store);
User.hasMany(Rating);
Store.hasMany(Rating);

module.exports = Rating;
