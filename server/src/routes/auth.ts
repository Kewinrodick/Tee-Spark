
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

const sendTokenResponse = (user: any, statusCode: number, res: express.Response) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  const userJson = user.toJSON();
  delete userJson.password;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user: userJson,
    });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide an email and password' });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out
// @route   GET /api/auth/logout
// @access  Private
router.get('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});


// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res) => {
  try {
    let token;

    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    const user = await User.findById(decoded.id);
    
    if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, user });

  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
});


export default router;
