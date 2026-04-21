import Hotel from "../models/hotelModel.js";

export const createHotel = async (req, res) => {
  try {
    const images = req.files.map(
      (file) => `http://localhost:5000/${file.path}`
    );

    const hotel = await Hotel.create({
      user: req.user.id,
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      contact: req.body.contact,
      images,
    });

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHotels = async (req, res) => {
  const hotels = await Hotel.find();
  res.json(hotels);
};