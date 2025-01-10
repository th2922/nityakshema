const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');
const app = express();



const doctorSchema = new mongoose.Schema({
 
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
});

// Middleware
app.use(express.json());




// JWT Secret Key
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key in production

// Login Route
app.post('/doctor/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: doctor._id, email: doctor.email },
      JWT_SECRET,
      { expiresIn: '4h' } // Token expiration time
    );

    res.json({ message: 'Login successful!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = mongoose.model('Doctor', doctorSchema);
