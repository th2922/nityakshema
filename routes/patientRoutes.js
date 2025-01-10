const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const patientController = require('../controllers/patientController');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Add a new patient
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const patient = new Patient({ name, email, password });
    await patient.save();
    res.status(201).json({ message: 'Patient added successfully', patient });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add patient' });
  }
});
// Route to get all patients
router.get('/', patientController.getAllPatients);

// Route to add a new patient
router.post('/', patientController.addPatient);


module.exports = router;
