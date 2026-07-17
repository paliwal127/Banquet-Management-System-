const Billing =
require("../models/Billing");

const createBilling =
async(req,res)=>{

 try{

  const {
   bookingId,
   totalAmount,
   advancePaid
  } = req.body;

  const bill =
  await Billing.createBilling(
   bookingId,
   totalAmount,
   advancePaid
  );

  res.status(201).json(
   bill
  );

 }
 catch(err){

  res.status(500).json({
   message:err.message
  });

 }

};


const db =
require("../config/db");

const revenueDashboard =
async(req,res)=>{

 try{

  const result =
  await db.query(
   `
   SELECT
   COUNT(*) AS total_bookings,
   SUM(total_amount)
   AS total_revenue
   FROM billings
   `
  );

  res.json(
   result.rows[0]
  );

 }
 catch(err){

  res.status(500).json({
   message:err.message
  });

 }

};

module.exports = { createBilling, revenueDashboard };