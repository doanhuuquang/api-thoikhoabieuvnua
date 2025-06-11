import { UserDTO } from "../DTOs/UserDTO";
import { User } from "../models/User";

export interface IUserService {
  auth(userDTO: UserDTO): Promise<{ token: string }>;
}
