import { Router } from "express";
import {
  getSchedule,
  getSemesterList,
} from "../controllers/schedule.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/:semesterCode", authenticateToken, getSchedule);
router.post("", authenticateToken, getSemesterList);

export default router;
