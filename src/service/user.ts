import { IUser } from "../entity/user";
import { UserRepository } from "../repository/user";
import { generateAccessToken } from "../utils/token";

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

    async loginUser(name: string, password: string, isAdmin: boolean) {
        const user: any = await this._userRepository.getUserByNameAndPassword(name, password)
        if (user == null) {
            return null
        }

        const tokenExpiresAt = process.env.TOKEN_EXPIRES_AT || '60'
        const expiresAt = Math.floor(new Date().getTime() / 1000) + parseInt(tokenExpiresAt)
        const accessToken = await generateAccessToken(user.id, isAdmin, expiresAt)

        const result = {
            id: user.id,
            name: user.name,
            isAdmin: isAdmin,
            accessToken: accessToken,
            expiresAt: expiresAt
        }

        return result
    }
}
