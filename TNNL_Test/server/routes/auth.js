const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Payment = require('../models/Payment');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/register', async (req, res) => {
  const { fname, lname, email, password } = req.body;
  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ message: 'User exists' });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ fname, lname, email, password: hashed });
    await user.save();

    res.json({ 
      message: 'User registered', 
      user: { 
        fname: user.fname, 
        lname: user.lname, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    res.json(user);
  } catch (err) {
    console.error('Token verify failed:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// delete user account and related data
router.delete('/delete', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Delete related payments
    await Payment.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and related data deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});


module.exports = router;
