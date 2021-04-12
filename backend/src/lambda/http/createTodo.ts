import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { ItemAccess } from '../../dataLayer/itemAccess'
import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';

const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event);
  const item = await new ItemAccess().createItem(newTodo, userId);
  
  return {
    statusCode: 201,
    body: JSON.stringify({item: item})
  };
}

export const handler = middyfy(api);
