
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');

const app = express();


const patientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
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

// Signup Route
app.post('/patient/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate that all fields are provided
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if the patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new patient
    const patient = new Patient({
      name,
      email,
      password: hashedPassword,
    });
    await patient.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
app.post('/patient/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if patient exists
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: patient._id, email: patient.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    res.json({ message: 'Login successful!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = mongoose.model('Patient', patientSchema);
