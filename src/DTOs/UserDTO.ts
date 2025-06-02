export class UserDTO {
  studentCode: string;
  password: string;

  constructor(studentCode: string, password: string) {
    this.studentCode = studentCode;
    this.password = password;
  }

  getStudentCode() {
    return this.studentCode;
  }

  getPassword() {
    return this.password;
  }
}
