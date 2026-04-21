import Driver from '../models/driverModel.js';

export const createDriver = async (req, res) => {
  try {
    const driver = await Driver.create({
      user: req.user.id,
      licenseNumber: req.body.licenseNumber,
      contact: req.body.contact,
    });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};