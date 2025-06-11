import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserDTO } from "../DTOs/UserDTO";

const userService = new UserService();

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentCode, password } = req.body;
    if (!studentCode || !password) {
      res.status(400).json({ message: "Thiếu thông tin xác thực" });
      return;
    }
    const userDTO: UserDTO = new UserDTO(studentCode, password);
    const token = await userService.auth(userDTO);
    res.json(token);
  } catch (err) {
    next(err);
  }
};

// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { studentCode, password } = req.body;
//     const userDTO: UserDTO = new UserDTO(studentCode, password);
//     const token = await userService.login(userDTO);
//     res.json(token);
//   } catch (err) {
//     next(err);
//   }
// };

// export const register = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { studentCode, password } = req.body;
//     const userDTO: UserDTO = new UserDTO(studentCode, password);
//     const token = await userService.register(userDTO);
//     res.json(token);
//   } catch (err) {
//     next(err);
//   }
// };

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentCode = (req as any).user.studentCode;
    const user = await userService.getUserByStudentCode(studentCode);
    if (user) {
      res.json(user);
      return;
    }

    res.status(404).json({ message: "Không tìm thấy người dùng" });
    return;
  } catch (err) {
    next(err);
  }
};
