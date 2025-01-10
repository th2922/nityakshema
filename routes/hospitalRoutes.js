const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital');
const hospitalController = require('../controllers/hospitalController');

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// Add a new hospital
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hospital = new Hospital({ name,address, email, password });
    await hospital.save();
    res.status(201).json({ message: 'Hospital added successfully', hospital });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add hospital' });
  }
});
// Route to get all hospitals
router.get('/', hospitalController.getAllHospitals);

// Route to add a new hospital
router.post('/', hospitalController.addHospital);

module.exports = router;
