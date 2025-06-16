import { ExamSubject } from "./ExamSubject";

export class ExamSchedule {
  private semesterString: string;
  private schedule: ExamSubject[];

  constructor() {
    this.schedule = [];
  }

  public getSemesterString(): string {
    return this.semesterString;
  }

  public setSemesterString(value: string): void {
    this.semesterString = value;
  }

  public getSchedule(): ExamSubject[] {
    return this.schedule;
  }

  public setSchedule(value: ExamSubject[]): void {
    this.schedule = value;
  }
}
