const express =
require("express");

const router =
express.Router();

const {
 addMenuItem
}
=
require("../controllers/menuController");

router.post(
 "/",
 addMenuItem
);

router.get("/", (req, res) => {
  res.json({
    message: "Use POST /api/menu to add a menu item.",
    query: req.query,
    body: req.body
  });
});

module.exports = router;