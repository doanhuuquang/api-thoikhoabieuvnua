import { TimeTableSchedule } from "../models/TimeTableSchedule";
import { UserDTO } from "../DTOs/UserDTO";
import { ExamSchedule } from "../models/ExamSchedule";

export interface IScheduleService {
  getTimeTableSchedules(userDTO: UserDTO): Promise<TimeTableSchedule[]>;
  getExamSchedules(userDTO: UserDTO): Promise<ExamSchedule[]>;
}
