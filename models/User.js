const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format']
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  domain: { type: String, required: true }
});
