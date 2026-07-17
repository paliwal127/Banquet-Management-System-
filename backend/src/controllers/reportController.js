const db = require("../config/db");

const getSummary = async (req, res) => {
  try {
    const bookingsResult = await db.query(`
      SELECT
        COUNT(*) AS total_bookings,
        SUM(total_amount) AS total_booking_value,
        SUM(COALESCE(advance_amount, 0)) AS total_advance_paid
      FROM bookings
    `);

    const billingsResult = await db.query(`
      SELECT
        COUNT(*) AS total_billings,
        SUM(total_amount) AS total_revenue,
        SUM(COALESCE(advance_paid, 0)) AS total_advance_paid
      FROM billings
    `);

    res.json({
      bookings: bookingsResult.rows[0],
      billings: billingsResult.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const getBookingStatusCounts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT booking_status, COUNT(*) AS count
      FROM bookings
      GROUP BY booking_status
      ORDER BY count DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  getSummary,
  getBookingStatusCounts
};
