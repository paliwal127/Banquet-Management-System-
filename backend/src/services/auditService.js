const AuditLog =
require("../models/AuditLog");

const logAction =
async(
 userId,
 action,
 moduleName
)=>{

 await AuditLog.createLog(
  userId,
  action,
  moduleName
 );

};

module.exports = {
 logAction
};