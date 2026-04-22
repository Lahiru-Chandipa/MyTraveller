import Package from "../models/packageModel.js";

export const createPackage = async (req, res) => {
  try {
    const { type, title, description, price, duration } = req.body;

    const allowedTypes = ["hotel", "driver", "full"];

    // BASIC VALIDATION
    if (!type || !title || !price || !duration) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid package type" });
    }

    const numericPrice = Number(price);
    const numericDuration = Number(duration);

    if (isNaN(numericPrice) || isNaN(numericDuration)) {
      return res.status(400).json({ message: "Price and duration must be numbers" });
    }

    if (numericPrice <= 0 || numericDuration <= 0) {
      return res.status(400).json({ message: "Price and duration must be greater than 0" });
    }

    // IMAGE HANDLING
    const images = req.files?.length
      ? req.files.map((f) => `${process.env.BASE_URL}/${f.path}`)
      : [];

    // STRICT PROFILE + TYPE VALIDATION

    if (type === "hotel") {
      if (!req.hotel) {
        return res.status(403).json({
          message: "Only approved hotels can create hotel packages",
        });
      }
    }

    if (type === "driver") {
      if (!req.driver) {
        return res.status(403).json({
          message: "Only approved drivers can create driver packages",
        });
      }
    }

    if (type === "full") {
      if (!req.hotel || !req.driver) {
        return res.status(403).json({
          message: "Full package requires both approved hotel and driver profiles",
        });
      }
    }

    // CREATE PACKAGE (SAFE)
    const pkg = await Package.create({
      createdBy: req.user.id,
      type,
      title,
      description,
      price: numericPrice,
      duration: numericDuration,

      // correct linking
      hotel: type !== "driver" ? req.hotel?._id : null,
      driver: type !== "hotel" ? req.driver?._id : null,

      images,
    });

    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPackages = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};