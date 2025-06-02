import { User } from "../models/User";
import { UserDTO } from "../DTOs/UserDTO";

export interface IUserService {
  login(userDTO: UserDTO): Promise<User>;
  register(userDTO: UserDTO): Promise<User>;
}
