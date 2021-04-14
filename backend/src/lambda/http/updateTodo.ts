import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';
import { todoLogic } from '../../businessLogic/todoLogic';

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //Get parameters from event
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event);

  //Call logic
  const updateTodo = await new todoLogic().updateTodo(userId, todoId, updatedTodo);

  //send reponse
  if (updateTodo) {
    return {
      statusCode: 200,
      body: ''
    }
  }

  return {
    statusCode: 404,
    body: ''
  }
}

export const handler = middyfy(api);


