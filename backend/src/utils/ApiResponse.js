class ApiResponse {

 static success(
  res,
  data,
  message="Success"
 ){

  return res.json({
   success:true,
   message,
   data
  });

 }

 static error(
  res,
  message,
  status=500
 ){

  return res.status(status)
  .json({
   success:false,
   message
  });

 }

}

module.exports =
ApiResponse;