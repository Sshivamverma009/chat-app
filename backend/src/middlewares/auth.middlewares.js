import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("Decoded Token:", token);

    if (!token) {
      console.log("User not Authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("Decoded ::", decoded);

    if (!decoded) {
      console.log("Invalid Token");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(decoded.userid).select("-password");

    console.log("User ::", user);

    if (!user) {
      console.log("User Not Found");
      return res.status(401).json({ message: "User not authenticated" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute:", error.message);
    return res.status(401).json({ message: "User not authenticated" });
  }
};
