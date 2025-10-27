
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import designsRouter from './routes/designs';
import usersRouter from './routes/users';
import purchasesRouter from './routes/purchases';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:9002',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

const uri = process.env.MONGO_URI;
if (uri) {
    mongoose.connect(uri);
    const connection = mongoose.connection;
    connection.once('open', () => {
      console.log("MongoDB database connection established successfully");
    })
} else {
    console.error("MONGO_URI is not defined in the environment variables.")
}

app.use('/api/designs', designsRouter);
app.use('/api/users', usersRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
