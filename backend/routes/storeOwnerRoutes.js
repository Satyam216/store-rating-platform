const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middlewares/auth");
const { myStoreStats } = require("../controllers/storeOwnerController");

router.use(auth, requireRole(["Store Owner"]));
router.get("/stats", myStoreStats);

module.exports = router;
