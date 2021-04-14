import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';
import { todoLogic } from '../../businessLogic/todoLogic';

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //Get parameters from event
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  
  //Call the logic
  const deleteTodo = await new todoLogic().deleteTodo(userId, todoId);

  //Send response
  if (deleteTodo) {
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


