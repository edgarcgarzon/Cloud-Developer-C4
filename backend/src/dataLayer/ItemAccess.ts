import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'

import {TodoItem} from '../models/TodoItem'
import {CreateTodoRequest} from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'


const XAWS = AWSXRay.captureAWS(AWS)


export class ItemAccess {


  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly indexName = process.env.INDEX_NAME,
    private readonly logger = createLogger('itemAcess')) {
  }

  /**
   * 
   * @param todoId Get item by Id
   */
  async GetItem(todoId: string, userId: string) {
    return await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId,
      }
    }).promise()
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
    
    const todoId = uuid.v4();

    //Define item
    const item:TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: request.name,
        dueDate: request.dueDate,
        done: false,
        attachmentUrl: ""
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
    
    this.logger.info(`Update item userId: ${userId}, todoId: ${todoId}`)

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
      UpdateExpression: 'set #itemName = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW',
    };

    const result = await this.docClient.update(params).promise();
    this.logger.info(`Update item: ${JSON.stringify(result.Attributes)}`);

    return result.Attributes as TodoItem;
    
  }
  /**
   * Update the URL attachment
   * @param userId 
   * @param todoId 
   * @param attachmentUrl 
   * @returns 
   */
  async UdateUrl(userId: String, todoId: string, attachmentUrl: string): Promise<TodoItem> {
    
    this.logger.info(`Update URL userId: ${userId}, todoId: ${todoId}`)

    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#au': 'attachmentUrl',
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
      },
      UpdateExpression: 'set #au = :attachmentUrl',
      ReturnValues: 'ALL_NEW',
    };

    const result = await this.docClient.update(params).promise();
    this.logger.info(`Update URL item: ${JSON.stringify(result.Attributes)}`);

    return result.Attributes as TodoItem;
  }

  /**
   * Delete a TODO item
   * @param userId 
   * @param todoId 
   */
  async DeleteItem(userId: string, todoId: string): Promise<boolean> {
    
    const deletion = await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ReturnValues: "ALL_OLD",
    }).promise();

    this.logger.info("Delete item: " + JSON.stringify(deletion));

    return deletion.Attributes? true: false;
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
