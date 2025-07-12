const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { uid, name, email, phone, domain } = req.body;

  if (!uid || !name || !email || !phone || !domain) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const firebaseUser = await admin.auth().getUser(uid);
    if (!firebaseUser || firebaseUser.email !== email) {
      return res.status(401).json({ error: 'Firebase UID verification failed' });
    }

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = new User({ uid, name, email, phone, domain });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
