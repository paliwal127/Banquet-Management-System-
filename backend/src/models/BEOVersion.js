const db = require("../config/db");

const createVersion = async (
  beoId,
  versionNo,
  content
) => {

  const result = await db.query(
    `
    INSERT INTO beo_versions
    (
      beo_id,
      version_no,
      content
    )
    VALUES($1,$2,$3)
    RETURNING *
    `,
    [
      beoId,
      versionNo,
      content
    ]
  );

  return result.rows[0];
};

module.exports = {
  createVersion
};