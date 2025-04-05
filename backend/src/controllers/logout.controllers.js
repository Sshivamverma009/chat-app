export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    console.log("user logged out successfully", res.status);
    return res.status(200).json({ message: "user logged out successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res
      .json({ message: "something went wrong while logging out" })
      .status(400);
  }
};
