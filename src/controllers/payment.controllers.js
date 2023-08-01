const paymentService = require("../services/payment.services");

const InitializePayment = async (req, res) => {
 try {
  const response = await paymentService.initiatePayment(req.user);
   res.status(response.statusCode).json(response);

  } catch (error) {
  return (
      res.status(500),
      json({
        message: "Unable to make payment",
        status: "failure",
      })
    );
  }
  
};

module.exports = {
  InitializePayment
};
