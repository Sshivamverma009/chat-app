import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateRefreshToken } from "../lib/utils.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email,"  ",password);

    if (!email || !password) {
      console.log("All fields are required");
      return res.json({ message: "All fields are required" }).status(400);
    }

    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      console.log("User doesn't exist, Please sign in");
      return res
        .status(400)
        .json({ message: "Email does not exist, Please sign in" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (!isPasswordCorrect) {
      console.log("password does not match");
      return res.json({ message: "password does not match" }).status(400);
    }

    const result = generateRefreshToken(existedUser._id, res);

    console.log("Result ::", result);
    console.log("Cookies Set:", res.getHeaders()["set-cookie"]); // Correct way to check cookies
  
    return res.status(200).json({
      userId: existedUser._id,
      name: existedUser.name,
      email: existedUser.email,
      profilePhoto: existedUser.profilePhoto,
    });
  } catch (error) {
    console.log("Error ::", error.message);
    return res.json({ Message: "Error occured" }, error.message).status(400);
  }
};
