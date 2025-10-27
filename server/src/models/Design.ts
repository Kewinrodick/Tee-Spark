'''
import mongoose from 'mongoose';

const DesignSchema = new mongoose.Schema({
  designerId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  tags: { type: [String], required: true },
});

export default mongoose.model('Design', DesignSchema);
'''