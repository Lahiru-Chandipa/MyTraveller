import Hotel from "../models/hotelModel.js";

export const createHotel = async (req, res) => {
  try {
    const { name, location, description, contact, pricePerNight } = req.body;

    if (!name || !location || !contact || !pricePerNight) {
      return res.status(400).json({ message: "Name, location, contact, and pricePerNight are required" });
    }

    const numericPricePerNight = Number(pricePerNight);

    if (isNaN(numericPricePerNight) || numericPricePerNight <= 0) {
      return res.status(400).json({ message: "pricePerNight must be a number greater than 0" });
    }

    const existingHotel = await Hotel.findOne({ user: req.user.id });

    if (existingHotel) {
      return res.status(400).json({ message: "Hotel profile already exists" });
    }

    const images = req.files?.length
      ? req.files.map((f) => `${process.env.BASE_URL}/${f.path}`)
      : [];

    const hotel = await Hotel.create({
      user: req.user.id,
      name,
      location,
      description,
      contact,
      pricePerNight: numericPricePerNight,
      images,
    });

    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
