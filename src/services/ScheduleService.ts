import { UserDTO } from "../DTOs/UserDTO";
import { Schedule } from "../models/Schedule";
import { WebScraper } from "../scrappers/webScraper";
import { IScheduleService } from "./IScheduleService";

export class ScheduleService implements IScheduleService {
  private webScraper: WebScraper;

  constructor() {
    this.webScraper = new WebScraper();
  }

  async getSchedule(userDTO: UserDTO, semesterCode: string): Promise<Schedule> {
    await this.webScraper.init();

    const { studentCode, password } = userDTO;
    const schedule = await this.webScraper.fetchScheduleOnWeb(
      studentCode,
      password,
      semesterCode
    );
    return schedule;
  }
}
