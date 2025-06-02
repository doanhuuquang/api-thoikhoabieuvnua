import User from "../models/UserModel";

class UserRepository {
  async findByStudentCode(studentCode: string) {
    return User.findOne({ studentCode: studentCode });
  }
}
