import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import paymentRoutes from './src/routes/payment';
import authRoutes from './src/routes/auth';
import designRoutes from './src/routes/designs';
import purchaseRoutes from './src/routes/purchases';
import userRoutes from './src/routes/users';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Connection error', error.message);
  });
