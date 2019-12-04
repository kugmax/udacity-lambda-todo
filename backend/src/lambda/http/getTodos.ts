import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { getTodoByUserId } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('get')

export const handler= middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Get todos:', event)

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
