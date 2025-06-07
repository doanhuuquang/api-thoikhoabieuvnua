import { Schedule } from "../models/Schedule";
import { UserDTO } from "../DTOs/UserDTO";

export interface IScheduleService {
  getSchedule(userDTO: UserDTO, semesterCode: string): Promise<Schedule>;
  getSemesterList(userDTO: UserDTO): Promise<string[]>;
}
