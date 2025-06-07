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
    const { semesterCode } = req.params;
    const userDTO: UserDTO = req.body;
    let schedule = await scheduleService.getSchedule(userDTO, semesterCode);

    const schedulesEntries = Array.from(schedule.schedules.entries());
    schedulesEntries.sort(([a], [b]) => a.localeCompare(b));
    const sortedSchedules = Object.fromEntries(schedulesEntries);

    res.json({
      semesterString: schedule.semesterString,
      semesterStartDate: schedule.semesterStartDate,
      schedules: sortedSchedules,
    });
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
    const userDTO: UserDTO = req.body;
    const semesters = await scheduleService.getSemesterList(userDTO);
    res.json({ semesters });
  } catch (err) {
    next(err);
  }
};
