export class User {
  name: string;
  studentCode: string;
  password: string;

  constructor(name: string, studentCode: string, password: string) {
    this.name = name;
    this.studentCode = studentCode;
    this.password = password;
  }
}
