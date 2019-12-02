import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

import { TodoStore } from '../store/todoStore'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import * as AWS  from 'aws-sdk'
// import { getUserId } from '../auth/utils'

const todoStore = new TodoStore()
// const s3 = new XAWS.S3({
//   signatureVersion: 'v4'
// })

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const todoAttachmentBucket = process.env.TODOS_ATTACHMENT_BUCKET
const urlExpiration = process.env.TODOS_ATTACHMENT_URL_EXP_SECONDS

export async function getTodoByUserId(userId: string): Promise<TodoItem[]> {
  return await todoStore.getTodoByUserId(userId)
}

export async function createTodo(
  request: CreateTodoRequest
): Promise<TodoItem> {

  const todoId = uuid.v4()

  return await todoStore.saveOrUpdate({
    userId: "kugmax",//TODO: need use id from auth
    todoId: todoId,
    name: request.name,
    dueDate: request.dueDate,
    done: false,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${todoAttachmentBucket}.s3.amazonaws.com/${todoId}`
  })
}

export async function updateTodo(
  todoId: string,
  request: UpdateTodoRequest
): Promise<TodoItem> {

  let savedTodo = await todoStore.getTodo(todoId, "kugmax")// TODO: need auth
  if (!savedTodo) {
    return null;
  }

  console.log("savedTodo: ", savedTodo)

  return await todoStore.saveOrUpdate(
    {
      userId: savedTodo.userId,
      todoId: savedTodo.todoId,
      name: request.name,
      dueDate: request.dueDate,
      done: request.done,
      createdAt: savedTodo.createdAt,
      attachmentUrl: savedTodo.attachmentUrl
    }
  );
}

export async function deleteTodo(todoId: string, userId: string) {
  let todo = await todoStore.getTodo(todoId, userId)
  if (!todo) {
      return;
  }


   await todoStore.delete(todo); 
}

export function generateUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: todoAttachmentBucket,
      Key: todoId,
      Expires: urlExpiration
  })
}