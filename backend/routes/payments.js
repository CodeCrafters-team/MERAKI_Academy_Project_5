const express = require("express");
const paymentsRouter = express.Router();

const { createPaymentIntent, confirmEnrollment } = require("../controllers/payment"); 
const { createEnrollment } = require("../controllers/enrollment"); 

paymentsRouter.post("/create-payment-intent", createPaymentIntent);

paymentsRouter.post("/confirm-enrollment", confirmEnrollment, createEnrollment);

module.exports = paymentsRouter;
