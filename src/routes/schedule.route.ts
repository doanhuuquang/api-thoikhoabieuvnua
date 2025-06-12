import { Router } from "express";
import { getSchedule } from "../controllers/schedule.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("", authenticateToken, getSchedule);

export default router;
