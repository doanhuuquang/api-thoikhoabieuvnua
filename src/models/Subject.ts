export class Subject {
  code: string;
  name: string;
  group: string;
  credit: number;
  classCode: string;
  start: number;
  numberOfLessons: number;
  room: string;
  lecturerName: string;
  subjectDate: string;

  constructor(
    code: string,
    name: string,
    group: string,
    credit: number,
    classCode: string,
    start: number,
    numberOfLessons: number,
    room: string,
    lecturerName: string,
    subjectDate: string
  ) {
    this.code = code || "";
    this.name = name || "";
    this.group = group || "";
    this.credit = credit || 0;
    this.classCode = classCode || "";
    this.start = start || 0;
    this.numberOfLessons = numberOfLessons || 0;
    this.room = room || "";
    this.lecturerName = lecturerName || "Đang cập nhật";
    this.subjectDate = subjectDate;
  }

  getCode() {
    return this.code;
  }
  setCode(code: string) {
    this.code = code;
  }

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
  }

  getGroup() {
    return this.group;
  }
  setGroup(group) {
    this.group = group;
  }

  getCredit() {
    return this.credit;
  }
  setCredit(credit: number) {
    this.credit = credit;
  }

  getClassCode() {
    return this.classCode;
  }
  setClassCode(classCode: string) {
    this.classCode = classCode;
  }

  getStart() {
    return this.start;
  }
  setStart(start: number) {
    this.start = start;
  }

  getNumberOfLessons() {
    return this.numberOfLessons;
  }
  setNumberOfLessons(numberOfLessons: number) {
    this.numberOfLessons = numberOfLessons;
  }

  getRoom() {
    return this.room;
  }
  setRoom(room: string) {
    this.room = room;
  }

  getLecturerName() {
    return this.lecturerName;
  }
  setLecturerName(lecturerName: string) {
    this.lecturerName = lecturerName;
  }

  getSubjectDate() {
    return this.subjectDate;
  }
  setSubjectDate(subjectDate: string) {
    this.subjectDate = subjectDate;
  }
}
