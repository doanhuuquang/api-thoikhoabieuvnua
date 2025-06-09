import { UserDTO } from "../DTOs/UserDTO";
import { User } from "../models/User";

export interface IUserService {
  login(userDTO: UserDTO): Promise<{ token: string }>;
  register(userDTO: UserDTO): Promise<{ token: string }>;
  getUserByStudentCode(id: string): Promise<User | null>;
}
