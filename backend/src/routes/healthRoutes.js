const express =
require("express");

const router =
express.Router();

router.get(
 "/",
 (req,res)=>{

  res.json({
   status:"UP",
   database:"Connected",
   timestamp:
   new Date()
  });

 }
);

module.exports =
router;