const db = require("../config/db");

const getAllHalls = async () => {
  const result = await db.query(
    "SELECT * FROM halls"
  );

  return result.rows;
};

const createHall = async (
  venue_id,
  name,
  max_capacity
) => {

  const result = await db.query(
    `INSERT INTO halls
    (venue_id,name,max_capacity)
    VALUES($1,$2,$3)
    RETURNING *`,
    [venue_id, name, max_capacity]
  );

  return result.rows[0];
};

module.exports = {
  getAllHalls,
  createHall
};