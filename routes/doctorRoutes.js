const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');

// Get all doctors
router.get('/', async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

// Add a new doctor
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const doctor = new Doctor({ name, email, password });
  await doctor.save();
  res.status(201).json({ message: 'Doctor added successfully', doctor });
});

module.exports = router;
