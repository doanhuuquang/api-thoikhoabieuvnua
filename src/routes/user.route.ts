import { Router } from "express";
import { auth, getUserProfile } from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/auth", auth);
router.get("/profile", authenticateToken, getUserProfile);

export default router;
