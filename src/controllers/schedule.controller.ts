import { NextFunction, Request, Response } from "express";
import { ScheduleService } from "../services/ScheduleService";
import { UserDTO } from "../DTOs/UserDTO";
import { Schedule } from "../models/Schedule";

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

    const userDTO: UserDTO = new UserDTO(studentCode, password);
    let schedules: Schedule[] = await scheduleService.getSchedule(userDTO);
    const result = schedules.map((sch) => ({
      ...sch,
      timeTable: sch.timeTable ? Object.fromEntries(sch.timeTable) : {},
    }));
    res.json(result);
    return;
  } catch (err) {
    next(err);
  }
};
