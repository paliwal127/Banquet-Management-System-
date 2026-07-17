const db = require("../config/db");

const createLog = async (
  userId,
  action,
  moduleName
) => {

  const result = await db.query(
    `
    INSERT INTO audit_logs
    (
      user_id,
      action,
      module_name
    )
    VALUES($1,$2,$3)
    RETURNING *
    `,
    [
      userId,
      action,
      moduleName
    ]
  );

  return result.rows[0];
};

module.exports = {
  createLog
};