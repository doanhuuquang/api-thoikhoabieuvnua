import { UserDTO } from "../DTOs/UserDTO";
import { Schedule } from "../models/Schedule";
import { WebScraper } from "../scrappers/webScraper";
import { IScheduleService } from "./IScheduleService";

export class ScheduleService implements IScheduleService {
  constructor() {}

  async getSchedule(userDTO: UserDTO, semesterCode: string): Promise<Schedule> {
    const webScraper = new WebScraper();

    const { studentCode, password } = userDTO;
    const schedule = await webScraper.fetchScheduleOnWeb(
      studentCode,
      password,
      semesterCode
    );
    return schedule;
  }

  async getSemesterList(userDTO: UserDTO): Promise<string[]> {
    const webScraper = new WebScraper();

    const { studentCode, password } = userDTO;
    const semesterNames: string[] = await webScraper.fetchSemesterNames(
      studentCode,
      password
    );
    return semesterNames;
  }
}
