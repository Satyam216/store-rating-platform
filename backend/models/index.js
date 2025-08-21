const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Store belongs to User (owner)
// Relations
Store.belongsTo(User, { as: "owner", foreignKey: "owner_id" });
User.hasMany(Store, { as: "storesOwned", foreignKey: "owner_id" });

Rating.belongsTo(User, { as: "ratedBy", foreignKey: "user_id" });
User.hasMany(Rating, { as: "ratingsGiven", foreignKey: "user_id" });

Rating.belongsTo(Store, { as: "ratedStore", foreignKey: "store_id" });
Store.hasMany(Rating, { as: "ratings", foreignKey: "store_id" });

module.exports = { User, Store, Rating };
