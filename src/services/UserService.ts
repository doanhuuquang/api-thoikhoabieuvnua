import { UserDTO } from "../DTOs/UserDTO";
import { WebScraper } from "../scrappers/webScraper";
import { IUserService } from "./IUserService";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export class UserService implements IUserService {
  constructor() {}

  async auth(userDTO: UserDTO): Promise<{ token: string }> {
    try {
      return await this.login(userDTO);
    } catch (error) {
      return await this.register(userDTO);
    }
  }

  async login(userDTO: UserDTO): Promise<{ token: string }> {
    const { studentCode, password } = userDTO;

    if (!studentCode || !password) {
      throw new Error("Mã sinh viên và mật khẩu không được để trống");
    }

    const userFromDB = await UserModel.findOne({ studentCode });

    if (userFromDB && (await bcrypt.compare(password, userFromDB.password))) {
      const token = jwt.sign(
        { studentCode: userFromDB?.studentCode },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "30d" }
      );

      return { token };
    }

    throw new Error("Tài khoản hoặc mật khẩu không chính xác");
  }

  async register(userDTO: UserDTO): Promise<{ token: string }> {
    const webScraper = new WebScraper();
    const { studentCode, password } = userDTO;

    if (!studentCode || !password) {
      throw new Error("Mã sinh viên và mật khẩu không được để trống");
    }

    const userFromWeb: User = await webScraper.verifyStudentLoginOnWeb(
      studentCode,
      password
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      studentCode: userFromWeb.studentCode,
      name: userFromWeb.name,
      dateOfBirth: userFromWeb.dateOfBirth || "Đang cập nhật",
      gender: userFromWeb.gender || "Đang cập nhật",
      status: userFromWeb.status || "Đang cập nhật",
      className: userFromWeb.className || "Đang cập nhật",
      faculty: userFromWeb.faculty || "Đang cập nhật",
      educationProgram: userFromWeb.educationProgram || "Đang cập nhật",
      major: userFromWeb.major || "Đang cập nhật",
      academicYear: userFromWeb.academicYear || "Đang cập nhật",
      phoneNumber: userFromWeb.phoneNumber || "Đang cập nhật",
      eduEmail: userFromWeb.eduEmail || "Đang cập nhật",
      personalEmail: userFromWeb.personalEmail || "Đang cập nhật",
      placeOfBirth: userFromWeb.placeOfBirth || "Đang cập nhật",
      identityNumber: userFromWeb.identityNumber || "Đang cập nhật",
      identityIssuedPlace: userFromWeb.identityIssuedPlace || "Đang cập nhật",
      nationality: userFromWeb.nationality || "Đang cập nhật",
      ethnicity: userFromWeb.ethnicity || "Đang cập nhật",
      bankAccountNumber: userFromWeb.bankAccountNumber || "Đang cập nhật",
      password: hashedPassword,
    });

    const token = jwt.sign(
      { studentCode: user.studentCode },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "30d" }
    );

    return { token };
  }

  async getUserByStudentCode(studentCode: string): Promise<User | null> {
    if (!studentCode) {
      throw new Error("Mã sinh viên không được để trống");
    }
    const user = await UserModel.findOne({ studentCode });
    return user ? new User(user.toObject()) : null;
  }
}
