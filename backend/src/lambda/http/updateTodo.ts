import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const toUpdate: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  const updatedTodo = await updateTodo(todoId, toUpdate, userId)

  console.log("updatedTodo: ", updatedTodo)

  if (!updatedTodo) {
  	 return {
	    statusCode: 404,
	    headers: {
	      'Access-Control-Allow-Origin': '*'
	    },
	    body: ''
	  }
  }

  return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(updatedTodo)
  }
}
