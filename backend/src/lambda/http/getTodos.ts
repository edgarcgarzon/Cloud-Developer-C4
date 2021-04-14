import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
import { todoLogic } from '../../businessLogic/todoLogic';

const logger =  createLogger('getTodos');

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //Get parameter from event
  const userId = getUserId(event);
  
  //call the logic
  const todos = await new todoLogic().getTodos(userId);

  //Return reponse
  return {
    statusCode: 200,
    body: JSON.stringify({items: todos})
  }
}

export const handler = middyfy(api);
