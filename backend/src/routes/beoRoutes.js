const express =
require("express");

const router =
express.Router();

const {
 createBEO
}
=
require("../controllers/beoController");

router.post(
 "/",
 createBEO
);

router.get("/", (req, res) => {
  res.json({
    message: "Use POST /api/beos to create a new BEO.",
    query: req.query,
    body: req.body
  });
});

module.exports=
router;