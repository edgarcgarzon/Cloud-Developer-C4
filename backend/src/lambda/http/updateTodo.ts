import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { ItemAccess } from '../../dataLayer/itemAccess'
import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const userId = getUserId(event);
  const updateTodo = await new ItemAccess().UdateItem(userId, todoId, updatedTodo);

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
