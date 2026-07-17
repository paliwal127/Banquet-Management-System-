const express = require("express");

const router = express.Router();

const {
  getBookings,
  addBooking
} = require("../controllers/bookingController");

router.get("/", getBookings);

router.post("/", addBooking);

module.exports = router;