import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'

import {TodoItem} from '../models/TodoItem'
import {CreateTodoRequest} from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)


export class ItemAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly indexName = process.env.INDEX_NAME) {
  }
  
  /**
   * Get all TODO items from user
   * @param userId 
   */
  async GetItems(userId: string) {
    
    //Query using the global index
    return await this.docClient.query({
        TableName : this.todosTable,
        IndexName : this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise();
  }

  /**
   *  Create TODO Item
   * @param request  Create Item
   * @param userId : The user ID associated to the new TODO item
   * @returns TODO item created
   */
  async createItem(request: CreateTodoRequest, userId: string): Promise<TodoItem> {
    
    //Define item
    const item:TodoItem = {
        userId: userId,
        todoId: uuid.v4(),
        createdAt: new Date().toISOString(),
        name: request.name,
        dueDate: request.dueDate,
        done: false,
        attachmentUrl: "www.udacity.com"
    };
    
    //put item into the DB
    await this.docClient.put({
        TableName: this.todosTable,
        Item: item
    } ).promise()

    return item;
  }

  /**
   *  update a TODO item
   * @param userId User id
   * @param todoId TODO id
   * @param updatedTodo TODO to be updated
   * @returns the updated item
   */
  async UdateItem(userId: String, todoId: string, updatedTodo: UpdateTodoRequest): Promise<TodoItem> {
    
    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#itemName': 'name',
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done,
      },
      UpdateExpression: 'SET #itemName = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW',
    };

    const result = await this.docClient.update(params).promise();
    return result.Attributes as TodoItem;
    
  }
}

/**
 * Auxiliary function in case of testing the serverless application offline (local)
 * @returns DynamoDB client.
 */
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
