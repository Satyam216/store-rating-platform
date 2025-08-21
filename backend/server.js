require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db");
require("./models"); // ensure associations load

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeOwnerRoutes = require("./routes/storeOwnerRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("API running"));

// mount
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", storeOwnerRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

sequelize.authenticate()
  .then(() => console.log("DB connected"))
  .catch((e) => console.error("DB error:", e.message));

sequelize.sync({ alter: false }).then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
});
