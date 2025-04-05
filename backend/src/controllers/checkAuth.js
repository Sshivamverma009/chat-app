export const checkAuth = (req, res) => {
  try {
    return res.json(req.user).status(200);
  } catch (error) {
    console.log("Error", error.message);
    return res.json("Error while authentication").status(400);
  }
};
