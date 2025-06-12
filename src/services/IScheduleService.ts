import { Schedule } from "../models/Schedule";
import { UserDTO } from "../DTOs/UserDTO";

export interface IScheduleService {
  getSchedule(userDTO: UserDTO): Promise<Schedule[]>;
}
