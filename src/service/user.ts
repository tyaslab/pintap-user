import { IUser } from "../entity/user";
import { UserRepository } from "../repository/user";

export class UserService {
    constructor (private readonly _userRepository: UserRepository) {}

    async createUser(user: IUser) {
        return await this._userRepository.create(user)
    }

    async getUserList() {
        return await this._userRepository.findAll()
    }

    async getUserDetail(userId: string) {
        return await this._userRepository.findOneById(userId)
    }

    async updateUser(user: IUser) {
        return await this._userRepository.update(user)
    }

    async deleteUser(userId: number) {
        return await this._userRepository.remove(userId)
    }
}
