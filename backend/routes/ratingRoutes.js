const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { upsertRating, getMyRatings } = require("../controllers/ratingController");

router.use(auth);
router.post("/", upsertRating);
router.get("/me", getMyRatings);

module.exports = router;
