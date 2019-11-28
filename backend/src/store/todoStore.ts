import * as AWS  from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

// const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class TodoStore {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todoIndexName = process.env.INDEX_NAME
  ) {

  }

  async getTodoByUserId(userId: string): Promise<TodoItem[]> {
    console.log('Getting todo by userId')

    const result = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.todoIndexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    console.log("getTodos:", result)

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodo(todoId: string): Promise<TodoItem> {
    const result = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.todoIndexName,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
          ':todoId': todoId
        }
      })
      .promise()

    console.log("getTodo:", result)

    if (result.Count == 0) {
      console.warn("Todo by id not found ", todoId)
      return null;
    }

    return result.Items[0] as TodoItem
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async updateTodo(todoId: string, newTodo: TodoItem) : Promise<TodoItem> {
    const updateResult = await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        "todoId": todoId
      },
      UpdateExpression: "set name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeValues: {
        ":name": newTodo.name,
        ":dueDate": newTodo.dueDate,
        ":done": newTodo.done        
      },
      ReturnValues:"UPDATED_NEW"
    });

    console.log("updateResult:", updateResult)

    return null;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    // return new XAWS.DynamoDB.DocumentClient({
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

//   return new XAWS.DynamoDB.DocumentClient()
  return new AWS.DynamoDB.DocumentClient()
}