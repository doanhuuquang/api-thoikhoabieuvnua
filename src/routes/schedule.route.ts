import { Router } from "express";
import { getSchedule } from "../controllers/schedule.controller";

const router = Router();

router.post("/:semesterCode", getSchedule);

export default router;
