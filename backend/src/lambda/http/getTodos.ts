import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { ItemAccess } from '../../dataLayer/itemAccess'
import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const userId = getUserId(event);
  const todos = await new ItemAccess().GetItems(userId);
    
  if (todos.Count !== 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({items: todos.Items})
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({items: []})
  }
}

export const handler = middyfy(api);
