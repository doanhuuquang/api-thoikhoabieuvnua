import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserDTO } from "../DTOs/UserDTO";

const userService = new UserService();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentCode, password } = req.body;
    const userDTO: UserDTO = new UserDTO(studentCode, password);
    const user = await userService.login(userDTO);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentCode, password } = req.body;
    const userDTO: UserDTO = new UserDTO(studentCode, password);
    const user = await userService.register(userDTO);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
