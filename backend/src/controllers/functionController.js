const FunctionModel =
require("../models/Function");

const {
  checkAvailability
} = require("../services/availabilityService");

const createFunction =
async (req, res) => {

  try {

    const {
      booking_id,
      hall_id,
      start_time,
      end_time,
      setup_time,
      guest_count,
      event_type
    } = req.body;

    const available =
      await checkAvailability(
        hall_id,
        start_time,
        end_time
      );

    if (!available) {

      return res.status(400).json({
        message:
        "Hall already booked"
      });

    }

    const functionData =
      await FunctionModel.createFunction(
        booking_id,
        hall_id,
        start_time,
        end_time,
        setup_time,
        guest_count,
        event_type
      );

    res.status(201).json(
      functionData
    );

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  createFunction
};