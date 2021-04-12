import {S3Handler, S3Event} from 'aws-lambda'
import { ItemAccess } from '../../dataLayer/ItemAccess';
import { createLogger } from '../../utils/logger'


const logger = createLogger('s3EventHandler');
const itemAccess = new ItemAccess();

export const handler:S3Handler = async (event:S3Event) => {
    for (const record of event.Records)
    {
        const key = record.s3.object.key
        logger.info("S3 Event for key: " + JSON.stringify(key));

        const parts = key.split("/");
        const userId = decodeURIComponent(parts[0]);
        const todoId = decodeURIComponent(parts[1]);

        const result = await itemAccess.UdateUrl(userId, todoId, todoId);
    }
}