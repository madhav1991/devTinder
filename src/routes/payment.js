const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay')
const Payment = require("../models/payment");
const User = require("../models/user");
import { membershipAmount } from '../utils/constants'

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    const { membershipType, firstName, lastName } = req.body;

    try {
        const order = await razorpayInstance.orders.create({
            amount: membershipAmount.membershipType * 100,
            // rely on backend for amount and not on FE 
            currency: "USD",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                membershipType
            }
        })

        //save it in db
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            paymentId: order.id,
            status: order.id,
            amount: order.id,
            currency: order.id,
            receipt: order.id,
            notes: order.id
        });

        const savedPayment = await payment.save();

        // send order details to frontend

        res.json({ ...savedPayment.toJSON() })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

// no userauth as razorpay cannto login as user for this webhook to work
paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
        const webhookSignature = req.get["X-Razorpay-Signature"];
        const isWebHookValid = validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, webhookSecret)
        // webhook_body should be raw webhook request body
        if (!isWebHookValid) {
            return res.status(400).json({ msg: "The singature is not valid" })
        }
        // next steps
        // update paymetn status in DB
        // update the user as Premium

        const pay = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id })
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findOne({ _id: payment.userId })
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;

        await user.save();

        res.status(200).json({ msg: "Webhook received successfully" })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
})

module.exports = paymentRouter;