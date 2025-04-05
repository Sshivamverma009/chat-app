import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateRefreshToken = (userid, res) => {
  const token = jwt.sign({ userid }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  console.log("generate token::");

  return token;
};
