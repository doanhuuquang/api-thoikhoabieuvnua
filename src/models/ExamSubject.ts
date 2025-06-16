export class ExamSubject {
  private code: string; // Mã môn học
  private name: string; // Tên môn học
  private examGroup: string; // Ghép thi
  private examGroupNumber: number; // Tổ thi
  private numberOfStudents: number; // Sĩ số
  private examDate: string; // Ngày thi
  private examRoom: string; // Phòng thi
  private start: number; // Tiết bắt đầu thi
  private numberOfLessons: number; // Số tiết thi
  private note: string; // Ghi chú

  constructor(
    code: string,
    name: string,
    examGroup: string,
    examGroupNumber: number,
    numberOfStudents: number,
    examDate: string,
    examRoom: string,
    start: number,
    numberOfLessons: number,
    note: string
  ) {
    this.code = code || "";
    this.name = name || "";
    this.examGroup = examGroup || "";
    this.examGroupNumber = examGroupNumber || 0;
    this.numberOfStudents = numberOfStudents || 0;
    this.examDate = examDate || "Buổi học cuối cùng của môn học trên lớp";
    this.examRoom = examRoom || "";
    this.start = start || 0;
    this.numberOfLessons = numberOfLessons || 0;
    this.note = note || "Không có ghi chú";
  }

  getCode(): string {
    return this.code;
  }
  setCode(code: string): void {
    this.code = code;
  }

  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }

  getExamGroup(): string {
    return this.examGroup;
  }
  setExamGroup(examGroup: string): void {
    this.examGroup = examGroup;
  }

  getExamGroupNumber(): number {
    return this.examGroupNumber;
  }
  setExamGroupNumber(examGroupNumber: number): void {
    this.examGroupNumber = examGroupNumber;
  }

  getNumberOfStudents(): number {
    return this.numberOfStudents;
  }
  setNumberOfStudents(numberOfStudents: number): void {
    this.numberOfStudents = numberOfStudents;
  }

  getExamDate(): string {
    return this.examDate;
  }
  setExamDate(examDate: string): void {
    this.examDate = examDate;
  }

  getExamRoom(): string {
    return this.examRoom;
  }
  setExamRoom(examRoom: string): void {
    this.examRoom = examRoom;
  }

  getStart(): number {
    return this.start;
  }
  setStart(start: number): void {
    this.start = start;
  }

  getNumberOfLessons(): number {
    return this.numberOfLessons;
  }
  setNumberOfLessons(numberOfLessons: number): void {
    this.numberOfLessons = numberOfLessons;
  }

  getNote(): string {
    return this.note;
  }
  setNote(note: string): void {
    this.note = note;
  }
}
