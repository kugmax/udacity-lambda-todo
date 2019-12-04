import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const toUpdate: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  const updatedTodo = await updateTodo(todoId, toUpdate, userId)

  logger.info("Update todo:", updatedTodo)

  if (!updatedTodo) {
     return {
	     statusCode: 404,
	     body: ''
     }
  }

  return {
      statusCode: 200,
      body: JSON.stringify(updatedTodo)
  }
})
handler.use(
  cors({
    credentials: true
  })
)
