import { IUser } from "../entity/user";
import { UserRepository } from "../repository/user";

export class UserService {
    constructor (private readonly _userRepository: UserRepository) {}

    createUser(user: IUser) {
        this._userRepository.save(user)
    }

    getUserList() {
        this._userRepository.findAll()
    }

    getUserDetail(userId: number) {
        this._userRepository.findOneById(userId)
    }

    updateUser(user: IUser) {
        this._userRepository.save(user)
    }

    deleteUser(userId: number) {
        this._userRepository.remove(userId)
    }
}
