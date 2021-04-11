import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { ItemAccess } from '../../dataLayer/itemAccess'
import { middyfy } from '../../../libs/lambda';

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const userId = "12345"
  const todos = await new ItemAccess().GetItems(userId);
    
  if (todos.Count !== 0) {
    return {
      statusCode: 200,
      body: JSON.stringify(todos.Items)
    }
  }

  return {
    statusCode: 404,
    body: ''
  }
}

export const handler = middyfy(api);
