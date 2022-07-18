import { IUser } from "../entity/user"
import { v4 } from "uuid"

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

export class UserRepository {
  private _tableName: string = 'UsersTable'
  constructor (private _docClient: AWS.DynamoDB.DocumentClient) {}

  async create(user: IUser) {
    const now = new Date().toISOString()
    user.id = v4()
    user.password = await this.generatePassword(user.password)
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
        ':password': await this.generatePassword(user.password)
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

  async generatePassword(rawPassword: string) {
    return await bcrypt.hash(rawPassword, 5)
  }

  async comparePassword(rawPassword: string, password: string) {
    return await bcrypt.compare(rawPassword, password)
  }

  async generateAccessToken(userId: string, isAdmin: boolean) {
    return jwt.sign({id: userId, isAdmin}, process.env.secretKey)
  }

  async decodeAccessToken(accessToken: string) {
    return jwt.verify(accessToken, process.env.secretKey)
  }
}
