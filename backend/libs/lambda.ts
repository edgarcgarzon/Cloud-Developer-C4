import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const middyfy = (handler) => {
  return middy(handler).use(  
    cors({
      credentials: true
  }))
}
