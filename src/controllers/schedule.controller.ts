import { NextFunction, Request, Response } from "express";
import { ScheduleService } from "../services/ScheduleService";
import { UserDTO } from "../DTOs/UserDTO";
import { TimeTableSchedule } from "../models/TimeTableSchedule";
import { ExamSchedule } from "../models/ExamSchedule";

const scheduleService = new ScheduleService();

export const getTimeTableSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentCode = (req as any).user.studentCode;
    const { password } = req.body;
    if (!studentCode || !password) {
      res.status(400).json({ message: "Thiếu thông tin xác thực" });
      return;
    }

    const userDTO: UserDTO = new UserDTO(studentCode, password);
    let timeTableSchedule: TimeTableSchedule[] =
      await scheduleService.getTimeTableSchedules(userDTO);

    const result = timeTableSchedule.map((sch) => {
      let sortedTimeTableSchedule = {};

      if (sch.schedule && typeof sch.schedule.entries === "function") {
        sortedTimeTableSchedule = Object.fromEntries(
          Array.from(sch.schedule.entries()).sort(
            ([dateA], [dateB]) =>
              new Date(dateA).getTime() - new Date(dateB).getTime()
          )
        );
      }
      return {
        ...sch,
        schedule: sortedTimeTableSchedule,
      };
    });
    res.json(result);
    return;
  } catch (err) {
    next(err);
  }
};

export const getExamSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentCode = (req as any).user.studentCode;
    const { password } = req.body;
    if (!studentCode || !password) {
      res.status(400).json({ message: "Thiếu thông tin xác thực" });
      return;
    }

    const userDTO: UserDTO = new UserDTO(studentCode, password);
    const examSchedules: ExamSchedule[] =
      await scheduleService.getExamSchedules(userDTO);

    res.json(examSchedules);
  } catch (err) {
    next(err);
  }
};
