const express = require("express");

const router = express.Router();

const {
  getVenues,
  addVenue
} = require("../controllers/venueController");

router.get("/", getVenues);

router.post("/", addVenue);

module.exports = router;