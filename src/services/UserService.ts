import { UserDTO } from "../DTOs/UserDTO";
import { WebScraper } from "../scrappers/webScraper";
import { IUserService } from "./IUserService";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        { studentCode: user.studentCode, name: user.name },
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
    const userFromWeb = await webScraper.verifyStudentLoginOnWeb(
      studentCode,
      password
    );

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu vào database
    const userSaved = await UserModel.create({
      name: userFromWeb.name,
      studentCode: userFromWeb.studentCode,
      password: hashedPassword,
    });

    // Tạo token
    const token = jwt.sign(
      { studentCode: userSaved.studentCode, name: userSaved.name },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "30d" }
    );

    return { token };
  }
}
