import { Router } from "express";
import {
  getSchedule,
  getSemesterList,
} from "../controllers/schedule.controller";

const router = Router();

router.post("/", getSemesterList);
router.post("/:semesterCode", getSchedule);

export default router;
