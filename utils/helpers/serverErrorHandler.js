const handleError = (res, error, message = "Server Error", statusCode = 500) => {
    return res.status(statusCode).json({
      status: "Error",
      message,
      details: error?.message || "Something went wrong",
    });
  };
  
  module.exports = {handleError}
  

  // to use 
  //  catch (error) {
// return handleError(res, error, "User not logged out");
