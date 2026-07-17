const express = require("express");

const router = express.Router();

const {
  checkHallAvailability,
  getAvailabilityByDate
} = require("../controllers/availabilityController");

router.post(
  "/check",
  checkHallAvailability
);

router.get("/", getAvailabilityByDate);

module.exports = router;
