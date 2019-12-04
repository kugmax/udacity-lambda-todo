import 'source-map-support/register'
import { generateUploadUrl } from '../../businessLogic/todos'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('genUrl')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("generateUploadUrl", event)

  const todoId = event.pathParameters.todoId

  const url = generateUploadUrl(todoId)
   return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
})


handler.use(
  cors({
    credentials: true
  })
)
