
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';
if (JWT_SECRET === 'your-very-secret-key') {
    console.warn('Warning: Using default JWT_SECRET. Please set a secure secret in your environment variables.');
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const newUser = new User({
      username,
      email,
      password,
      role,
    });

    await newUser.save();
    
    // Don't log in the user automatically after signup for this implementation
    // The user will be prompted to log in after signing up.
    
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({ message: 'User created successfully. Please log in.', user: userWithoutPassword });

  } catch (err: any) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json({ message: 'Login successful', user: userWithoutPassword });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logout successful' });
});


// GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ user: userWithoutPassword });

    } catch (err) {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

export default router;
