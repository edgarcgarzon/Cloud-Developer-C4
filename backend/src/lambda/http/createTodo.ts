import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';
import { todoLogic } from '../../businessLogic/todoLogic';


const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //Get parameters from event
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event);

  //Call the logic
  const item = await new todoLogic().createTodo(newTodo, userId);
  
  //send response
  return {
    statusCode: 201,
    body: JSON.stringify({item: item})
  };
}

export const handler = middyfy(api);


