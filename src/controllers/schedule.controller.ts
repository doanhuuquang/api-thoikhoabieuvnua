import { NextFunction, Request, Response } from "express";
import { ScheduleService } from "../services/ScheduleService";
import { UserDTO } from "../DTOs/UserDTO";

const scheduleService = new ScheduleService();

export const getSchedule = async (
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
    const { semesterCode } = req.params;

    const userDTO: UserDTO = new UserDTO(studentCode, password);
    let schedule = await scheduleService.getSchedule(userDTO, semesterCode);

    const schedulesEntries = Array.from(schedule.schedules.entries());
    schedulesEntries.sort(([a], [b]) => a.localeCompare(b));
    const sortedSchedules = Object.fromEntries(schedulesEntries);
    res.json({
      semesterString: schedule.semesterString,
      semesterStartDate: schedule.semesterStartDate,
      schedules: sortedSchedules,
    });
    return;
  } catch (err) {
    next(err);
  }
};

export const getSemesterList = async (
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
    const semesters = await scheduleService.getSemesterList(userDTO);
    res.json({ semesters });
    return;
  } catch (err) {
    next(err);
  }
};
