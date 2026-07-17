const db = require("../config/db");

const createBEO = async (
  functionId
) => {

  const result = await db.query(
    `
    INSERT INTO beos
    (function_id)
    VALUES($1)
    RETURNING *
    `,
    [functionId]
  );

  return result.rows[0];
};

const getBEOById = async (id) => {

  const result = await db.query(
    `
    SELECT *
    FROM beos
    WHERE id=$1
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createBEO,
  getBEOById
};