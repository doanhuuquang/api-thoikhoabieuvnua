import { Router } from "express";
import {
  login,
  register,
  getUserProfile,
} from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticateToken, getUserProfile);

export default router;
