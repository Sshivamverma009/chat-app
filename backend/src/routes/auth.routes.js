import express from "express";
import { signUp } from "../controllers/signup.controllers.js";
import { login } from "../controllers/login.controllers.js";
import { logout } from "../controllers/logout.controllers.js";
import { update } from "../controllers/update.controllers.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import { checkAuth } from "../controllers/checkAuth.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, update);

router.get('/check', protectRoute, checkAuth);

export default router;
