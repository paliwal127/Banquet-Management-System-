const express =
require("express");

const router =
express.Router();

const {
 createLayout
}
=
require("../controllers/layoutController");

router.post(
 "/",
 createLayout
);

router.get("/", (req, res) => {
  res.json({
    message: "Use POST /api/layouts to create a layout.",
    query: req.query,
    body: req.body
  });
});

module.exports = router;