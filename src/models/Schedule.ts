import { Subject } from "./Subject";

export class Schedule {
  semesterString: string;
  semesterStartDate: string;
  schedules: Map<string, Subject[]>;
  schedule: { [k: string]: Subject[]; };

  constructor() {
    this.schedules = new Map<string, Subject[]>();
  }

  public getSemesterString(): string {
    return this.semesterString;
  }

  public setSemesterString(value: string): void {
    this.semesterString = value;
  }

  public getSemesterStartDate(): string {
    return this.semesterStartDate;
  }

  public setSemesterStartDate(value: string): void {
    this.semesterStartDate = value;
  }

  public getSchedules(): Map<string, Subject[]> {
    return this.schedules;
  }

  public setSchedules(value: Map<string, Subject[]>): void {
    this.schedules = value;
  }
}
