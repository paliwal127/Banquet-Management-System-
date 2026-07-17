const Billing = require("../models/Billing");
const db = require("../config/db");

const createBilling = async (req, res) => {
  try {
    const {
      bookingId,
      totalAmount,
      advancePaid
    } = req.body;

    const bill = await Billing.createBilling(
      bookingId,
      totalAmount,
      advancePaid
    );

    res.status(201).json(bill);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

const revenueDashboard = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT
      COUNT(*) AS total_bookings,
      COALESCE(SUM(total_amount),0) AS total_revenue
      FROM billings
    `);

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  createBilling,
  revenueDashboard
};