import { IUser } from "../entity/user"
import { v4 } from "uuid"

export class UserRepository {
  constructor (private _docClient: AWS.DynamoDB.DocumentClient) {}

  save(user: IUser) {
    return this._docClient.put({
      TableName: 'UsersTable',
      Item: {
        ...user,
        userID: v4()
      }
    })
  }

  findOneById(userId: number) {

  }

  findAll() {

  }

  remove(userId: number) {

  }
}
