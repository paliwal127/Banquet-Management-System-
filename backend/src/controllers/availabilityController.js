const {
  checkAvailability,
  getHallAvailabilityByDate
} = require("../services/availabilityService");

const checkHallAvailability =
async (req, res) => {

  try {

    const {
      hallId,
      startTime,
      endTime
    } = req.body;

    const available =
      await checkAvailability(
        hallId,
        startTime,
        endTime
      );

    res.json({
      available
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

const getAvailabilityByDate =
async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.json({
        message: "Use POST /api/availability/check to check hall availability.",
        query: req.query,
        body: req.body
      });
    }

    const availability = await getHallAvailabilityByDate(date);

    res.json({
      success: true,
      message: "Hall availability retrieved successfully.",
      data: availability
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  checkHallAvailability,
  getAvailabilityByDate
};