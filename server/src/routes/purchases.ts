'''
import express from 'express';
import Purchase from '../models/Purchase';

const router = express.Router();

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new purchase
router.post('/', async (req, res) => {
  const purchase = new Purchase({
    buyerId: req.body.buyerId,
    designId: req.body.designId,
    purchaseDate: new Date(),
    amount: req.body.amount,
    transactionId: req.body.transactionId,
  });

  try {
    const newPurchase = await purchase.save();
    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
'''