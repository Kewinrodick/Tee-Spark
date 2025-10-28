import { Schema, model, Document } from 'mongoose';

export interface IPurchase extends Document {
  buyerName: string;
  buyerEmail: string;
  designerName: string;
  designerEmail: string;
  designTitle: string;
  price: number;
  purchaseDate: Date;
  contractId: string;
}

const PurchaseSchema = new Schema({
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  designerName: { type: String, required: true },
  designerEmail: { type: String, required: true },
  designTitle: { type: String, required: true },
  price: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  contractId: { type: String, required: true, unique: true },
});

export default model<IPurchase>('Purchase', PurchaseSchema);
