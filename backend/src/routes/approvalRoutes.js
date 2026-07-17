const express =
require("express");

const router =
express.Router();

const {
 approveBEO
}
=
require("../controllers/approvalController");

router.put(
 "/:beoId",
 approveBEO
);

router.get("/", (req, res) => {
  res.json({
    message: "Use PUT /api/approvals/:beoId to approve a BEO.",
    query: req.query,
    body: req.body
  });
});

module.exports = router;