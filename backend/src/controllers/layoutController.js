const Layout =
require("../models/Layout");

const createLayout =
async(req,res)=>{

 try{

  const {
   hallId,
   layoutName,
   seatingCapacity,
   config
  } = req.body;

  const layout =
  await Layout.createLayout(
   hallId,
   layoutName,
   seatingCapacity,
   config
  );

  res.status(201).json(
   layout
  );

 }
 catch(err){

  res.status(500).json({
   message:err.message
  });

 }

};

module.exports = {
 createLayout
};