const Doctor = require('../models/doctor');

// Controller to get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Controller to add a new doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new doctor instance
    const doctor = new Doctor({ name, email, password });

    // Save doctor to database
    await doctor.save();

    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add doctor' });
  }
};

// Export the controllers
module.exports = {
  getAllDoctors,
  addDoctor,
};
