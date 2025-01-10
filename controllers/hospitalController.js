const Hospital = require('../models/hospital');

// Controller to get all hospitals
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};

// Controller to add a new hospital
const addHospital = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create a new hospital instance
    const hospital = new Hospital({ name,address, email, password });

    // Save hospital to database
    await hospital.save();

    res.status(201).json({ message: 'Hospital added successfully', hospital });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add hospital' });
  }
};

// Export the controllers
module.exports = {
  getAllHospitals,
  addHospital,
};
