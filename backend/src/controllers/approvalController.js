const db =
require("../config/db");

const approveBEO =
async(req,res)=>{

 try{

  const {
   beoId
  } = req.params;

  const result =
  await db.query(
   `
   UPDATE beos
   SET approved=true,
       status='Approved'
   WHERE id=$1
   RETURNING *
   `,
   [beoId]
  );

  res.json(
   result.rows[0]
  );

 }
 catch(err){

  res.status(500).json({
   message:err.message
  });

 }

};

module.exports = {
 approveBEO
};