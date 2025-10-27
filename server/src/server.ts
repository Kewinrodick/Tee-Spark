'''
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import designsRouter from './routes/designs';
import usersRouter from './routes/users';
import purchasesRouter from './routes/purchases';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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

app.use('/designs', designsRouter);
app.use('/users', usersRouter);
app.use('/purchases', purchasesRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
'''