# Pintap - User

## Setup
1. Make sure you have installed aws-cli and configure it. For more info: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html

```
$ aws configure
```

2. Run dynamodb via docker
```
$ docker run --name mydynamodb -p 8000:8000 -d amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
```

3. Create new table in dynamodb
```
$ aws dynamodb create-table --table-name UsersTable --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --endpoint-url http://localhost:8000
```

4. Create .env by copy the example.env
```
$ cp example.env .env
```

5. Install modules
```
$ npm install
```

6. Run server locally
```
$ npm run dev
```

7. You can access it via `http://localhost:3000`


## Endpoints
### 1. Create User (POST http://localhost:3000/dev/user)

Example request body:
```
{
	"name": "aditya2345",
	"password": "jamet2345"
}
```

Example response:
```
{
	"id": "8bc95db9-06fb-412b-bb75-da12a85bb672",
	"name": "aditya2345",
	"createdAt": "2022-07-19T04:49:56.176Z"
}
```

### 2. Get User List (GET http://localhost:3000/dev/user)

Example response:
```
[
	{
		"id": "4596214e-9822-45d3-87f7-ac067116a973",
		"name": "aditya2345",
		"createdAt": "2022-07-19T04:29:04.248Z"
	},
	{
		"id": "807a6279-c7a4-43fc-b9e0-884d85ce90ac",
		"name": "aditya234",
		"createdAt": "2022-07-19T04:17:21.574Z"
	}
]
```

### 3. Get User Detail (GET http://localhost:3000/dev/user/{id})

Example response:
```
{
	"id": "8bc95db9-06fb-412b-bb75-da12a85bb672",
	"name": "aditya2345",
	"createdAt": "2022-07-19T04:49:56.176Z"
}
```

### 4. Update User (PUT http://localhost:3000/dev/user/{id}) (requires JWT Authorization)

Note: user must be *admin OR user itself*

Success response returns 204 No Content

Example error response:
```
{
	"message": "Name already existed",
	"code": 400
}
```

### 5. Delete User (DELETE http://localhost:3000/dev/user/{id}) (requires JWT Authorization)

Note: user must be *admin*

Success response returns 204 No Content

Example error response:
```
{
	"message": "User not found",
	"code": 404
}
```

### 6. Login User (POST http://localhost:3000/dev/user/login)

If login as admin, don't forget to add "isAdmin: true" in the request body

Example request:
```
{
	"name": "aditya234",
	"password": "strongpasswordever",
	"isAdmin": true
}
```

Example response:
```
{
	"id": "807a6279-c7a4-43fc-b9e0-884d85ce90ac",
	"name": "aditya234",
	"isAdmin": true,
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwN2E2Mjc5LWM3YTQtNDNmYy1iOWUwLTg4NGQ4NWNlOTBhYyIsImlzQWRtaW4iOnRydWUsImV4cCI6MTY1ODIwNTA3MSwiaWF0IjoxNjU4MjA1MDExfQ.UiLWWV5oalIk48Fo9ldc9QeOMNckBjOHwsb44tdx8lI",
	"expiresAt": 1658205071
}
```

Example error response:
```
{
	"message": "Invalid username/password",
	"code": 400
}
```


## Authorization error response

Token expired (HTTP status code: 401)
```
{
	"message": "Token expired",
	"code": 4011
}
```

Invalid token (HTTP status code: 401)
```
{
	"message": "Invalid token",
	"code": 4012
}
```

Forbidden (HTTP status code: 403)
```
{
	"message": "You are not allowed",
	"code": 403
}
```