const db = require("../config/db");

const createMenuItem = async (
  name,
  category,
  cost,
  price,
  dietary_type
) => {

  const result = await db.query(
    `
    INSERT INTO menu_items
    (
      name,
      category,
      cost,
      price,
      dietary_type
    )
    VALUES($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      name,
      category,
      cost,
      price,
      dietary_type
    ]
  );

  return result.rows[0];
};

module.exports = {
  createMenuItem
};