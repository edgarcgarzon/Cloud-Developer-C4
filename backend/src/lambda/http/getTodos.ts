import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { ItemAccess } from '../../dataLayer/itemAccess'
import { middyfy } from '../../../libs/lambda';
import { getUserId } from '../utils';
import { FileAccess } from '../../dataLayer/fileAccess';
import { createLogger } from '../../utils/logger'

const logger =  createLogger('getTodos');

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const userId = getUserId(event);
  const todos = await new ItemAccess().GetItems(userId);
    
  if (todos.Count !== 0) {

    //For each items get the URL for the attachment 
    todos.Items.map(x =>{ 
      if(x.attachmentUrl !== ""){
        x.attachmentUrl = new FileAccess().getGetUrl(x.userId, x.attachmentUrl)
      }});

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
