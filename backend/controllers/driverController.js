import Driver from '../models/driverModel.js';

export const createDriver = async (req, res) => {
  try {
    const { licenseNumber, contact } = req.body;

    if (!licenseNumber || !contact) {
      return res.status(400).json({ message: "License number and contact are required" });
    }

    const existingDriver = await Driver.findOne({ user: req.user.id });

    if (existingDriver) {
      return res.status(400).json({ message: "Driver profile already exists" });
    }

    const driver = await Driver.create({
      user: req.user.id,
      licenseNumber,
      contact,
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
