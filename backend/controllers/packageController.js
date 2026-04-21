import Package from "../models/packageModel.js";
import Hotel from "../models/hotelModel.js";
import Driver from "../models/driverModel.js";

export const createPackage = async (req, res) => {
  try {
    const { type, title, description, price, duration } = req.body;

    if (!type || !title || !price || !duration) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const images = req.files.map(
      (f) => `http://localhost:5000/${f.path}`
    );

    let hotel = null;
    let driver = null;

    if (req.user.role === "hotel") {
      hotel = await Hotel.findOne({ user: req.user.id });
    }

    if (req.user.role === "driver") {
      driver = await Driver.findOne({ user: req.user.id });
    }

    const pkg = await Package.create({
      createdBy: req.user.id,
      type,
      title,
      description,
      price,
      duration,
      hotel: hotel?._id,
      driver: driver?._id,
      images,
    });

    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPackages = async (req, res) => {
  const { type, minPrice, maxPrice } = req.query;

  let filter = {};

  if (type) filter.type = type;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const packages = await Package.find(filter)
    .populate("hotel")
    .populate("driver");

  res.json(packages);
};