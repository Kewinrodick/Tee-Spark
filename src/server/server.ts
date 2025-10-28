import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import paymentRoutes from './src/routes/payment'; // Corrected path

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Connection error', error.message);
  });
