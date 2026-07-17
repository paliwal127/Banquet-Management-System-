const Billing = require("../models/Billing");

const createBilling = async (bookingId, totalAmount, advancePaid) => {
  return Billing.createBilling(bookingId, totalAmount, advancePaid);
};

const getRevenueDashboard = async () => {
  return Billing.getRevenueDashboard();
};

module.exports = {
  createBilling,
  getRevenueDashboard
};
