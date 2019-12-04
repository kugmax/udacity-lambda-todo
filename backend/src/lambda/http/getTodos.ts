import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { getTodoByUserId } from '../../businessLogic/todos'
import { getUserId } from '../utils'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler= middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log(event)

  const userId = getUserId(event)

  const todos = await getTodoByUserId(userId)	

  return {
    statusCode: 201,
    body: JSON.stringify({
      items: todos
    })
  }
})
handler.use(
  cors({
    credentials: true
  })
)
