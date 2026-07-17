const express =
require("express");

const router =
express.Router();

const {
 register,
 login
}
=
require("../controllers/authController");

router.post(
 "/register",
 register
);

router.post(
 "/login",
 login
);

router.get("/", (req, res) => {
  res.json({
    message: "Use POST /api/auth/register to register or POST /api/auth/login to sign in.",
    query: req.query,
    body: req.body
  });
});

module.exports =
router;