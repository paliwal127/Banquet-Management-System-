const {
 createBEOWithVersion
}
=
require("../services/beoService");

const createBEO =
async (req,res)=>{

 try{

  const {
   functionId,
   content
  }
  =
  req.body;

  const beo =
  await createBEOWithVersion(
   functionId,
   content
  );

  res.status(201).json(beo);

 }
 catch(err){

  res.status(500).json({
   message:err.message
  });

 }

};

module.exports={
 createBEO
};