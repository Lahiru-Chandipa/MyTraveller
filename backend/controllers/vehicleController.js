import Vehicle from "../models/vehicleModel.js";

export const createVehicle = async (req, res) => {
  try {
    const { type, model, capacity, pricePerDay } = req.body;

    if (!type || !model || !capacity || !pricePerDay) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const numericCapacity = Number(capacity);
    const numericPricePerDay = Number(pricePerDay);

    if (isNaN(numericCapacity) || isNaN(numericPricePerDay)) {
      return res.status(400).json({ message: "Capacity and pricePerDay must be numbers" });
    }

    if (numericCapacity <= 0 || numericPricePerDay <= 0) {
      return res.status(400).json({ message: "Capacity and pricePerDay must be greater than 0" });
    }

    const images = req.files?.length
      ? req.files.map((f) => `${process.env.BASE_URL}/${f.path}`)
      : [];

    const vehicle = await Vehicle.create({
      driver: req.driver._id,
      type,
      model,
      capacity: numericCapacity,
      pricePerDay: numericPricePerDay,
      images,
    });

    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
