// backend/routes/register.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');

router.post('/api/register', async (req, res) => {
  const { uid, name, email, phone, domain } = req.body;

  console.log("📥 Incoming register request body:", req.body);

  if (!uid || !name || !email || !phone || !domain) {
    console.warn("⚠️ Missing fields in request");
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log("🔍 Verifying UID with Firebase Admin SDK...");
    const firebaseUser = await admin.auth().getUser(uid);

    if (!firebaseUser || firebaseUser.email !== email) {
      console.warn("❌ Firebase UID mismatch or not found");
      return res.status(401).json({ error: 'Firebase UID verification failed' });
    }

    console.log("✅ Firebase user verified:", firebaseUser.email);

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      console.log("ℹ️ User already exists in DB:", existingUser.email);
      return res.status(409).json({ error: 'User already exists' });
    }

    console.log("💾 Saving new user to MongoDB...");
    const newUser = new User({ uid, name, email, phone, domain });
    await newUser.save();

    console.log("🎉 User registered successfully");
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('❌ Registration error caught:', error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
