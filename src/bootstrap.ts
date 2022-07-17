import { UserRepository } from "./repository/user";
import { UserService } from "./service/user";

export const userRepository = new UserRepository()
export const userService = new UserService(userRepository)
