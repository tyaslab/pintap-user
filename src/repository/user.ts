import { IUser } from "../entity/user"
import { v4 } from "uuid"

export class UserRepository {
  private _tableName: string = 'UsersTable'
  constructor (private _docClient: AWS.DynamoDB.DocumentClient) {}

  async save(user: IUser) {
    const now = new Date().toISOString()
    if (user.id == null) {
      user.id = v4()
      user.createdAt = now
    }

    user.updatedAt = now

    return this._docClient.put({
      TableName: this._tableName,
      Item: user
    }).promise()
  }

  async findOneById(userId: string) {
    const params = {
      TableName: this._tableName,
      Key: {
        id: userId
      }
    }

    const data = await this._docClient.get(params).promise()

    return data.Item
  }

  async findAll() {
    const params = {
      TableName: this._tableName,
      ExpressionAttributeNames: {
        '#deletedAt': 'deletedAt'
      },
      ExpressionAttributeValues: {
        ':deletedAt': {'S': ''}
      },
      // KeyConditionExpression: 'deletedAt = :deletedAt'
      FilterExpression: '#deletedAt = :deletedAt'
    }

    const data = await this._docClient.scan(params).promise()
    return data.Items
  }

  async remove(userId: number) {
    const params = {
      TableName: this._tableName,
      Key: {
        id: userId
      },
      UpdateExpression: 'set deletedAt = NULL'
    }
    
    await this._docClient.update(params).promise()
  }
}
