import { UserRepository } from "./repository/user"
import { UserService } from "./service/user"
import AWS from 'aws-sdk'

let options = {}
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
}

const docClient = new AWS.DynamoDB.DocumentClient(options)

export const userRepository = new UserRepository(docClient)
export const userService = new UserService(userRepository)
