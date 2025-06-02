import { UserDTO } from "../DTOs/UserDTO";
import { User } from "../models/User";
import { WebScraper } from "../scrappers/webScraper";
import { IUserService } from "./IUserService";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";

export class UserService implements IUserService {
  private webScraper: WebScraper;

  constructor() {
    this.webScraper = new WebScraper();
  }

  async login(userDTO: UserDTO): Promise<User> {
    await this.webScraper.init();
    const { studentCode, password } = userDTO;
    if (!studentCode || !password) {
      throw new Error("Mã sinh viên và mật khẩu không được để trống");
    }

    const user = await UserModel.findOne({ studentCode });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new Error("Tài khoản hoặc mật khẩu không chính xác");
    }
  }

  async register(userDTO: UserDTO): Promise<User> {
    await this.webScraper.init();
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
    const userFromWeb = await this.webScraper.verifyStudentLoginOnWeb(
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

    return userSaved;
  }
}
