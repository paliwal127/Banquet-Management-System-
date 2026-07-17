const db = require("../config/db");

const createLayout = async (
  hallId,
  layoutName,
  seatingCapacity,
  config
) => {

  const result = await db.query(
    `
    INSERT INTO layouts
    (
      hall_id,
      layout_name,
      seating_capacity,
      config
    )
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [
      hallId,
      layoutName,
      seatingCapacity,
      config
    ]
  );

  return result.rows[0];
};

module.exports = {
  createLayout
};