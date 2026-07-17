const db = require("../config/db");

const createFunction = async (
  booking_id,
  hall_id,
  start_time,
  end_time,
  setup_time,
  guest_count,
  event_type
) => {

  const result = await db.query(
    `
    INSERT INTO functions
    (
      booking_id,
      hall_id,
      start_time,
      end_time,
      setup_time,
      guest_count,
      event_type
    )
    VALUES($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      booking_id,
      hall_id,
      start_time,
      end_time,
      setup_time,
      guest_count,
      event_type
    ]
  );

  return result.rows[0];
};

module.exports = {
  createFunction
};