const cron =
require("node-cron");

const db =
require("../config/db");

cron.schedule(
 "0 * * * *",
 async()=>{

  try{

   await db.query(
    `
    UPDATE bookings
    SET booking_status='Released'
    WHERE booking_status='Tentative'
    AND created_at
    <
    NOW() - INTERVAL '48 hours'
    `
   );

   console.log(
    "Tentative bookings released"
   );

  }
  catch(err){

   console.log(err);

  }

 }
);