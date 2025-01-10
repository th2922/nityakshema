const Patient = require('../models/patient');

// Controller to get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

// Controller to add a new patient
const addPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create a new patient instance
    const patient = new Patient({ name, email, password });

    // Save patient to database
    await patient.save();

    res.status(201).json({ message: 'Patient added successfully', patient });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add patient' });
  }
};

// Export the controllers
module.exports = {
  getAllPatients,
  addPatient,
};
