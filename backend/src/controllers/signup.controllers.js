import { generateRefreshToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Received name:", name);

    // Ensure all required fields are provided
    if (!name || !email || !password || password.length < 6) {
      console.log("All fields are required!");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      console.log("User already exists:", existedUser);
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save new user to database
    await newUser.save();
    if (!newUser) {
      return res.status(500).json({ message: "Error saving user" });
    }

    // Generate refresh token
    const result = generateRefreshToken(newUser._id, res);
    if (!result) {
      console.error("Error generating refresh token");
    }

    console.log("User created successfully:", newUser);
    return res.status(201).json({ message: "User Created Successfully", newUser });

  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
