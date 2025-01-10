const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospital');

const app = express();
const PORT = 3000;
const hospitalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },

});

// Middleware
app.use(express.json()); // Parse JSON bodies


// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key in production

// Signup Route
// Updated Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, address, password, confirmPassword } = req.body;

    // Validate that all fields are provided
    if (!name || !email || !address || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if the hospital already exists
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: 'Hospital already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new hospital
    const hospital = new Hospital({
      name,
      email,
      address,
      password: hashedPassword,
    });
    await hospital.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if hospital exists
    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, hospital.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: hospital._id, email: hospital.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    res.json({ message: 'Login successful!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = mongoose.model('Hospital', hospitalSchema);
