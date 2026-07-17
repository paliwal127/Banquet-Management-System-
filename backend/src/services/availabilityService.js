const db = require("../config/db");

const checkAvailability = async (
  hallId,
  startTime,
  endTime
) => {

  const result = await db.query(
    `
    SELECT *
    FROM functions
    WHERE hall_id = $1
    AND (
      start_time < $3
      AND end_time > $2
    )
    `,
    [hallId, startTime, endTime]
  );

  return result.rows.length === 0;
};

const getHallAvailabilityByDate = async (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const startOfDay = `${date} 00:00:00`;
  const endOfDay = `${date} 23:59:59`;

  const result = await db.query(
    `
    SELECT
      h.id AS hall_id,
      h.name,
      h.max_capacity AS capacity,
      NOT EXISTS (
        SELECT 1
        FROM functions f
        WHERE f.hall_id = h.id
          AND f.start_time < $2
          AND f.end_time > $1
      ) AS is_available
    FROM halls h
    ORDER BY h.name
    `,
    [startOfDay, endOfDay]
  );

  return result.rows;
};

module.exports = {
  checkAvailability,
  getHallAvailabilityByDate
};