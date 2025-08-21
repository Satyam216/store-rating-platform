const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { listStores } = require("../controllers/adminController");

// Normal users after login can view/search
router.get("/", auth, listStores);

module.exports = router;
