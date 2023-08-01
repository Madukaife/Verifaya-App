const express = require('express');
const router = express.Router();
const paymentController = require("../controllers/payment.controllers");
const authMiddleware = require("../middlewares/auth");

// router.post('/payment', paymentController.InitializePayment);

router.post('/payment',authMiddleware.authenticate,paymentController.InitializePayment);

module.exports = router
