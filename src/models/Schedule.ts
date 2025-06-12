import { Subject } from "./Subject";

export class Schedule {
  semesterString: string;
  semesterStartDate: string;
  timeTable: Map<string, Subject[]>;

  constructor() {
    this.timeTable = new Map<string, Subject[]>();
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

  public getTimeTable(): Map<string, Subject[]> {
    return this.timeTable;
  }

  public setTimeTable(value: Map<string, Subject[]>): void {
    this.timeTable = value;
  }
}
