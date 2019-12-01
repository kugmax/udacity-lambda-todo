import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const toUpdate: UpdateTodoRequest = JSON.parse(event.body)

  const updatedTodo = await updateTodo(todoId, toUpdate)

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
