const Venue = require("../models/Venue");

const getVenues = async (req,res) => {

  try {

    const venues =
      await Venue.getAllVenues();

    res.json(venues);

  } catch(err) {

    res.status(500).json({
      message: err.message
    });

  }
};

const addVenue = async (req,res) => {

  try {

    const {
      name,
      capacity,
      location_type
    } = req.body;

    const venue =
      await Venue.createVenue(
        name,
        capacity,
        location_type
      );

    res.status(201).json(venue);

  } catch(err) {

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  getVenues,
  addVenue
};