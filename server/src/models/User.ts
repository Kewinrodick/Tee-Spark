'''
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['Designer', 'Buyer', 'Admin'] },
  profileImageUrl: { type: String },
});

export default mongoose.model('User', UserSchema);
'''