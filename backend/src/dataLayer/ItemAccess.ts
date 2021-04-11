import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'

import {TodoItem} from '../models/TodoItem'
import {CreateTodoRequest} from '../requests/CreateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)


export class ItemAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly groupsTable = process.env.TODOS_TABLE) {
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
        TableName: this.groupsTable,
        Item: item
    } ).promise()

    return item;
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
