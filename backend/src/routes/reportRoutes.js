const express = require("express");
const router = express.Router();
const {
  getSummary,
  getBookingStatusCounts
} = require("../controllers/reportController");

router.get("/", getSummary);
router.get("/bookings", getBookingStatusCounts);

module.exports = router;
