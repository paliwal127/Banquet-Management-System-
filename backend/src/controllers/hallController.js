const Hall = require("../models/Hall");

const getHalls = async (req,res) => {

  try {

    const halls =
      await Hall.getAllHalls();

    res.json(halls);

  } catch(err) {

    res.status(500).json({
      message: err.message
    });

  }
};

const addHall = async (req,res) => {

  try {

    const {
      venue_id,
      name,
      max_capacity
    } = req.body;

    const hall =
      await Hall.createHall(
        venue_id,
        name,
        max_capacity
      );

    res.status(201).json(hall);

  } catch(err) {

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  getHalls,
  addHall
};