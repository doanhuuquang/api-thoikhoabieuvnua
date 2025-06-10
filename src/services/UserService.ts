import { UserDTO } from "../DTOs/UserDTO";
import { WebScraper } from "../scrappers/webScraper";
import { IUserService } from "./IUserService";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export class UserService implements IUserService {
  constructor() {}

  async login(userDTO: UserDTO): Promise<{ token: string }> {
    const { studentCode, password } = userDTO;
    if (!studentCode || !password) {
      throw new Error("Mã sinh viên và mật khẩu không được để trống");
    }

    const user = await UserModel.findOne({ studentCode });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Tạo token
      const token = jwt.sign(
        { studentCode: user.studentCode },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "30d" }
      );
      return { token };
    } else {
      throw new Error("Tài khoản hoặc mật khẩu không chính xác");
    }
  }

  async register(userDTO: UserDTO): Promise<{ token: string }> {
    const webScraper = new WebScraper();

    const { studentCode, password } = userDTO;
    if (!studentCode || !password) {
      throw new Error("Mã sinh viên hoặc mật khẩu không được null");
    }

    const existingUser = await UserModel.findOne({ studentCode });
    if (existingUser) {
      throw new Error(
        "Tài khoản này đã được đăng ký trước đó rồi, vui lòng chuyển sang đăng nhập nhé"
      );
    }

    // Xác thực tài khoản trên web đào tạo
    const userFromWeb: User = await webScraper.verifyStudentLoginOnWeb(
      studentCode,
      password
    );

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu vào database
    const userSaved = await UserModel.create({
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

    // Tạo token
    const token = jwt.sign(
      { studentCode: userSaved.studentCode },
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
