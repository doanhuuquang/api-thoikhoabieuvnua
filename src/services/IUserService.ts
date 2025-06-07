import { UserDTO } from "../DTOs/UserDTO";

export interface IUserService {
  login(userDTO: UserDTO): Promise<{ token: string }>;
  register(userDTO: UserDTO): Promise<{ token: string }>;
}
