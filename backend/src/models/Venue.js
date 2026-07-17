const db = require("../config/db");

const getAllVenues = async () => {
  const result = await db.query("SELECT * FROM venues ORDER BY id");
  return result.rows;
};

const getVenueById = async (id) => {
  const result = await db.query(
    "SELECT * FROM venues WHERE id=$1",
    [id]
  );
  return result.rows[0];
};

const createVenue = async (
  name,
  capacity,
  location_type
) => {
  const result = await db.query(
    `INSERT INTO venues
    (name,capacity,location_type)
    VALUES($1,$2,$3)
    RETURNING *`,
    [name, capacity, location_type]
  );

  return result.rows[0];
};

module.exports = {
  getAllVenues,
  getVenueById,
  createVenue
};