const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middlewares/auth");
const { dashboardCounts, addUser, listUsers, userDetails, addStore, listStores } = require("../controllers/adminController");

router.use(auth, requireRole(["System Administrator"]));

router.get("/dashboard", dashboardCounts);
router.post("/users", addUser);
router.get("/users", listUsers);
router.get("/users/:id", userDetails);

router.post("/stores", addStore);
router.get("/stores", listStores);

module.exports = router;