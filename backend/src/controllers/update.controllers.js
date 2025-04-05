import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.models.js";

export const update = async (req, res) => {
  try {
    const { profilePhoto } = await req.body;

    if (!profilePhoto) {
      console.log("Profile Photo not found");
      return res.json({ message: "ProfilePhoto not found" }).status(400);
    }

    const userId = req.user._id;

    const result = await cloudinary.uploader.upload(profilePhoto);

    const res = await User.update(
      { userId },
      { profile: result.secure_url },
      { new: true }
    );

    if (!res) {
      console.log("image upload unsuccessful");
      return res
        .json({ message: "Image upload unsuccessful" }, res)
        .status(400);
    }

    console.log("image uploaded successfully");
    return res
      .json({ message: "image uploaded successfully" }, res)
      .status(200);
  } catch (error) {
    console.log("Error", error.message);
    return res.json({ message: "Error while updating profile" }).status(400);
  }
};
