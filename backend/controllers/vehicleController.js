import Vehicle from "../models/vehicleModel.js";
import Driver from "../models/driverModel.js";

export const createVehicle = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const images = req.files.map(
      (file) => `http://localhost:5000/${file.path}`
    );

    const vehicle = await Vehicle.create({
      driver: driver._id,
      type: req.body.type,
      model: req.body.model,
      capacity: req.body.capacity,
      pricePerDay: req.body.pricePerDay,
      images,
    });

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};