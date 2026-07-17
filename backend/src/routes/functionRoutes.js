const express = require("express");

const router = express.Router();

const {
  createFunction
} = require("../controllers/functionController");

router.post(
  "/",
  createFunction
);

router.get("/", (req, res) => {
  res.json({
    message: "Use POST /api/functions to create a new function.",
    query: req.query,
    body: req.body
  });
});

module.exports = router;