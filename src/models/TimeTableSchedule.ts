import { Subject } from "./Subject";

export class TimeTableSchedule {
  semesterString: string;
  semesterStartDate: string;
  schedule: Map<string, Subject[]>;

  constructor() {
    this.schedule = new Map<string, Subject[]>();
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

  public getSchedule(): Map<string, Subject[]> {
    return this.schedule;
  }

  public setSchedule(value: Map<string, Subject[]>): void {
    this.schedule = value;
  }
}
