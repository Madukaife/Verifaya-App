const axios = require("axios");
const Transaction = require("../models/transaction.model")
const responses = require("../utils/response");
const generateReference = require("../utils/generatePaymentReference");


const initiatePayment = async (user) => {    // user is what controller will pass to services, since its been logged in and authorised with token
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        },
      };
        const body = {
            amount: Number(process.env.AMOUNT) * 100,
            email: user.email,
            reference: generateReference()
        };

      const response = await axios.post(process.env.PAYSTACK_URL, body, options);
      const paymentLink = response.data;
      await Transaction.create({...body, amount:body.amount/100});
        return responses.buildSuccessResponse("Transaction Initialized", 200, paymentLink)
    } catch (error) {
        console.log(error);
        return responses.buildFailureResponse(error?.message, error?.statusCode)
    }
}
const paystackWebhook = async (payload) => {
  try {
    const foundPayment = await Transaction.findOne({ reference: payload.data.reference });
    const updateData = {
      transactionId: payload.data.id,
      channel: payload.data.channel,
      currency: payload.data.currency,
      ipAddress: payload.data.ip_address,
      paidAt: payload.data.paidAt,
      status: payload.data.status,
    };
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      { _id: foundPayment._id },
      updateData,
      { new: true }
    );
    
    return responses.buildSuccessResponse("transcation Noted", 200);
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  initiatePayment,
  paystackWebhook
}
