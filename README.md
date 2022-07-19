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
