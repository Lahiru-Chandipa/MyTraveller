import User from "../models/userModel.js";
import Driver from "../models/driverModel.js";
import Hotel from "../models/hotelModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      token: generateToken(user),
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const driverProfile = await Driver.findOne({ user: user._id });
    const hotelProfile = await Hotel.findOne({ user: user._id });

    const userData = user.toObject();
    delete userData.password;

    res.json({
      token: generateToken(user),
      user: userData,
      driverProfile,
      hotelProfile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
