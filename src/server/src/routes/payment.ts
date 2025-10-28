// server/src/routes/payment.ts

import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Purchase from '../models/Purchase'; // You'll need to create this model

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// 1. CREATE ORDER ENDPOINT
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in the smallest currency unit (paise)
      currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

// 2. VERIFY PAYMENT ENDPOINT
router.post('/verify-payment', async (req, res) => {
  const { order_id, payment_id, signature, buyerId, designId, amount, currency } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(order_id + '|' + payment_id)
    .digest('hex');

  if (generated_signature === signature) {
    // Payment is authentic. Save it to the database.
    const newPurchase = new Purchase({
        buyerId,
        designId,
        paymentId: payment_id,
        orderId: order_id,
        amount,
        currency,
        status: 'paid',
    });
    await newPurchase.save();

    res.json({ status: 'success', purchaseId: newPurchase._id });
  } else {
    res.status(400).json({ status: 'failure', message: 'Invalid signature' });
  }
});

export default router;
