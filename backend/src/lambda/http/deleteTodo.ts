import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { ItemAccess } from '../../dataLayer/itemAccess'
import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const userId = getUserId(event);
  const deleteTodo = await new ItemAccess().DeleteItem(userId, todoId);

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
