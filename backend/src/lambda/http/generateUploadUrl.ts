import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { middyfy } from '../../../libs/lambda'
import { getUserId } from '../utils'
import { todoLogic } from '../../businessLogic/todoLogic'

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //Get parameters from event
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  
  //call the logic
  const signedURL = await new todoLogic().getUploadUrl(userId, todoId);
 
  //send the response
  if (signedURL === ""){
    return {
      statusCode: 404,
      body: `TODO item: ${todoId} is not found`
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({uploadUrl:signedURL})
  }
}

export const handler = middyfy(api);


