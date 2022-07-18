import { IUser } from "../entity/user"
import { v4 } from "uuid"
import { comparePassword, generatePassword } from "../utils/password"

export class UserRepository {
  private _tableName: string = 'UsersTable'
  constructor (private _docClient: AWS.DynamoDB.DocumentClient) {}

  async create(user: IUser) {
    const now = new Date().toISOString()
    user.id = v4()
    user.password = await generatePassword(user.password)
    user.createdAt = now
    user.updatedAt = now
    user.deletedAt = '-'
    return this._docClient.put({
      TableName: this._tableName,
      Item: user
    }).promise()
  }

  async update(user: IUser) {
    const now = new Date().toISOString()
    const params = {
      TableName: this._tableName,
      Key: {
        id: user.id
      },
      UpdateExpression: 'set #updatedAt = :updatedAt, #name = :name, #password = :password',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#updatedAt': 'updatedAt',
        '#password': 'password'
      },
      ExpressionAttributeValues: {
        ':name': user.name,
        ':updatedAt': now,
        ':password': await generatePassword(user.password)
      }
    }

    await this._docClient.update(params).promise()
  }

  async findOneById(userId: string) {
    const params = {
      TableName: this._tableName,
      Key: {
        id: userId
      }
    }

    const data = await this._docClient.get(params).promise()

    const item: any = data.Item

    if (item.deletedAt != '-') {
      return null
    }

    return item
  }

  async findAll() {
    const params = {
      TableName: this._tableName,
      ExpressionAttributeNames: {
        '#deletedAt': 'deletedAt'
      },
      ExpressionAttributeValues: {
        ':deletedAt': '-'
      },
      // KeyConditionExpression: 'deletedAt = :deletedAt'
      FilterExpression: '#deletedAt = :deletedAt'
    }

    const data = await this._docClient.scan(params).promise()
    return data.Items
  }

  async remove(userId: number) {
    const now = new Date().toISOString()
    const params = {
      TableName: this._tableName,
      Key: {
        id: userId
      },
      UpdateExpression: 'set deletedAt = :deletedAt',
      ExpressionAttributeValues: {
        ':deletedAt': now
      }
    }

    await this._docClient.update(params).promise()
  }

  async getUserByNameAndPassword(name: string, password: string) {
    // get user by name and password
    const params = {
      TableName: this._tableName,
      ExpressionAttributeNames: {
        '#deletedAt': 'deletedAt',
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':deletedAt': '-',
        ':name': name
      },
      // KeyConditionExpression: 'deletedAt = :deletedAt'
      FilterExpression: '#deletedAt = :deletedAt AND #name = :name'
    }

    const data = await this._docClient.scan(params).promise()

    if (!data.Items) {
      return null
    }

    const user = data.Items[0]

    const isCorrectPassword = await comparePassword(password, user.password)

    if (!isCorrectPassword) {
      return null
    }

    return user
  }
}
