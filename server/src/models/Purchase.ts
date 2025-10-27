'''
import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  buyerId: { type: String, required: true },
  designId: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
});

export default mongoose.model('Purchase', PurchaseSchema);
'''