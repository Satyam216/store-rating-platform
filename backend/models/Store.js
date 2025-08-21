const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Store = sequelize.define("Store", {
  name: { type: DataTypes.STRING(100), allowNull: false },
  address: { type: DataTypes.STRING(400) },
});

Store.belongsTo(User, { as: "owner" });
User.hasMany(Store, { foreignKey: "ownerId" });

module.exports = Store;
