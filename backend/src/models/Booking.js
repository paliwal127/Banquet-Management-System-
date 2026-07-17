const db = require("../config/db");

const getAllBookings = async () => {
  const result = await db.query("SELECT * FROM bookings ORDER BY start_date ASC");
  return result.rows;
};

const createBooking = async ({
  id,
  venue_id,
  customer_id,
  event_name,
  start_date,
  end_date,
  billing_amount,
  paid_amount,
  status
}) => {
  const result = await db.query(
    `
    INSERT INTO bookings (
      id,
      venue_id,
      customer_id,
      event_name,
      start_date,
      end_date,
      billing_amount,
      paid_amount,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      id,
      venue_id,
      customer_id,
      event_name,
      start_date,
      end_date,
      billing_amount,
      paid_amount,
      status
    ]
  );

  return result.rows[0];
};

module.exports = {
  getAllBookings,
  createBooking
};