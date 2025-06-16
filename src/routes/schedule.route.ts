import { Router } from "express";
import {
  getTimeTableSchedules,
  getExamSchedules,
} from "../controllers/schedule.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/time-table", authenticateToken, getTimeTableSchedules);
router.post("/exam", authenticateToken, getExamSchedules);

export default router;
