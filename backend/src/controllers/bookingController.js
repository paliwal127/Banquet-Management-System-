const Booking = require("../models/Booking");

const getBookings = async (req,res) => {

  try {

    const bookings =
      await Booking.getAllBookings();

    res.json(bookings);

  } catch(err) {

    res.status(500).json({
      message: err.message
    });

  }
};

const addBooking = async (req,res) => {

  try {

    const {
      id,
      venue_id,
      customer_id,
      event_name,
      start_date,
      end_date,
      billing_amount,
      paid_amount,
      status
    } = req.body;

    const booking =
      await Booking.createBooking({
        id,
        venue_id,
        customer_id,
        event_name,
        start_date,
        end_date,
        billing_amount,
        paid_amount,
        status
      });

    res.status(201).json(booking);

  } catch(err) {

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  getBookings,
  addBooking
};