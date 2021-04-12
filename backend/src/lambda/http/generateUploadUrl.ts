import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { FileAccess } from '../../dataLayer/fileAccess'
import { ItemAccess } from '../../dataLayer/itemAccess'
import { middyfy } from '../../../libs/lambda'
import { getUserId } from '../utils'

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const userId = getUserId(event);
  const item = await new ItemAccess().GetItem(todoId, userId);
  
  if(!item.Item)
  {
    return {
      statusCode: 404,
      body: `TODO item: ${todoId} is not found`
    }
  }
  const signedURL = await new FileAccess().getUploadUrl(userId, todoId);
  return {
    statusCode: 200,
    body: JSON.stringify({uploadUrl:signedURL})
  }
}

export const handler = middyfy(api);
