
import express from 'express';
import User from '../models/User';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// The POST route for creating a user here is redundant and insecure.
// User creation should be handled by the /api/auth/signup endpoint,
// which correctly hashes passwords and handles authentication.
// This endpoint is removed to prevent conflicts and security issues.

export default router;
