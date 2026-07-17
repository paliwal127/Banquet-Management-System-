const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const roleMiddleware =
require("../middlewares/roleMiddleware");

const {
  createBilling,
  revenueDashboard
} = require("../controllers/billingController");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Finance", "BanquetMgr"),
  createBilling
);

router.get(
  "/revenue",
  authMiddleware,
  roleMiddleware("Finance", "BanquetMgr"),
  revenueDashboard
);

router.get("/", (req, res) => {
  res.json({
    message: "Use POST /api/billing to create a billing entry or GET /api/billing/revenue for revenue stats.",
    query: req.query,
    body: req.body
  });
});

module.exports = router;