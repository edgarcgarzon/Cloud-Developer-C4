import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const logger =  createLogger('getTodos');
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3()
export class FileAccess {

    constructor(
      private readonly imagesBucketName = process.env.TODO_APP_S3_BUCKET,
      private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }

    getGetUrl(userId: string, fileId:string){

        logger.info(`Get signed URL for key: ${userId}/${fileId}`)

        return s3.getSignedUrl('getObject', {
            Bucket: this.imagesBucketName,
            Key: `${userId}/${fileId}`,
            Expires: this.urlExpiration
          })
    }

    /**
     * Get signed URL for image upload
     * @param fileId 
     * @returns 
     */
    getUploadUrl(userId:string, fileId: string) {

        logger.info(`Get signed URL for key: ${userId}/${fileId}`)
        
        return s3.getSignedUrl('putObject', {
          Bucket: this.imagesBucketName,
          Key: `${userId}/${fileId}`,
          Expires: this.urlExpiration
        })
    }
  }