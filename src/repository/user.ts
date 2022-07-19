import { IUser } from "../entity/user"
import { v4 } from "uuid"
import { comparePassword, generatePassword } from "../utils/password"
import { ValidationError } from "../utils/error_handler"

export class UserRepository {
  private _tableName: string = 'UsersTable'
  constructor (private _docClient: AWS.DynamoDB.DocumentClient) {}

  async validateCreate(user: IUser) {

  }

  async create(user: IUser) {
    // check name
    const checkName = await this.getUserByName(user.name)
    if (checkName != null) {
      throw new ValidationError('Name already existed', 400)
    }

    user.id = v4()
    user.password = await generatePassword(user.password)
    const now = new Date().toISOString()
    user.createdAt = now
    user.updatedAt = now
    user.deletedAt = '-'
    return this._docClient.put({
      TableName: this._tableName,
      Item: user
    }).promise()
  }

  async update(user: IUser) {
    const checkName = await this.getUserByName(user.name)
    if (checkName != null && user.id != checkName.id) {
      throw new ValidationError('Name already existed', 400)
    }

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

    if (item && item.deletedAt != '-') {
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

  async getUserByName(name: string) {
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
    return user
  }

  async getUserByNameAndPassword(name: string, password: string) {
    const user = await this.getUserByName(name)
    if (!user) {
      return null
    }

    const isCorrectPassword = await comparePassword(password, user.password)

    if (!isCorrectPassword) {
      return null
    }

    return user
  }
}
