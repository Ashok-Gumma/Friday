import { Router } from "express";
import { signup, login, googleLogin, updateProfile, getProfile } from "../controllers/authController.js";
import { protect } from "../lib/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;