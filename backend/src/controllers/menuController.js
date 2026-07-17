const MenuItem =
require("../models/MenuItem");

const addMenuItem =
async(req,res)=>{

 try{

  const {
   name,
   category,
   cost,
   price,
   dietary_type
  } = req.body;

  const item =
  await MenuItem.createMenuItem(
   name,
   category,
   cost,
   price,
   dietary_type
  );

  res.status(201).json(item);

 }
 catch(err){

  res.status(500).json({
   message:err.message
  });

 }

};

module.exports = {
 addMenuItem
};