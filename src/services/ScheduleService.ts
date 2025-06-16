import { UserDTO } from "../DTOs/UserDTO";
import { ExamSchedule } from "../models/ExamSchedule";
import { TimeTableSchedule } from "../models/TimeTableSchedule";
import { WebScraper } from "../scrappers/webScraper";
import { IScheduleService } from "./IScheduleService";

export class ScheduleService implements IScheduleService {
  constructor() {}

  async getTimeTableSchedules(userDTO: UserDTO): Promise<TimeTableSchedule[]> {
    const webScraper = new WebScraper();

    const { studentCode, password } = userDTO;
    const timeTableSchedules = await webScraper.fetchTimeTableSchedulesOnWeb(
      studentCode,
      password
    );
    return timeTableSchedules;
  }

  async getExamSchedules(userDTO: UserDTO): Promise<ExamSchedule[]> {
    const webScraper = new WebScraper();

    const { studentCode, password } = userDTO;
    const examSchedules = await webScraper.fetchExamSchedulesOnWeb(
      studentCode,
      password
    );
    return examSchedules;
  }
}
