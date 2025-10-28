import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  buyerId: mongoose.Schema.Types.ObjectId;
  designId: mongoose.Schema.Types.ObjectId;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
}

const PurchaseSchema: Schema = new Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: true,
    },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    status: {
      type: String,
      required: true,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);
