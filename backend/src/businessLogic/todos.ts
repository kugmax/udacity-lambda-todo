import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'

import { TodoStore } from '../store/todoStore'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { createLogger } from '../utils/logger'

const logger = createLogger('todoLogic')
const todoStore = new TodoStore()

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const todoAttachmentBucket = process.env.TODOS_ATTACHMENT_BUCKET
const urlExpiration = process.env.TODOS_ATTACHMENT_URL_EXP_SECONDS

export async function getTodoByUserId(userId: string): Promise<TodoItem[]> {
  return await todoStore.getTodoByUserId(userId)
}

export async function createTodo(
  request: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const todoId = uuid.v4()

  const toSave = {
    userId: userId,
    todoId: todoId,
    name: request.name,
    dueDate: request.dueDate,
    done: false,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${todoAttachmentBucket}.s3.amazonaws.com/${todoId}`
  };

    
  await todoStore.saveOrUpdate(toSave)
  return toSave;
}

export async function updateTodo(
  todoId: string,
  request: UpdateTodoRequest,
  userId: string
): Promise<TodoItem> {

  let savedTodo = await todoStore.getTodo(todoId, userId)
  if (!savedTodo) {
    return null;
  }

  logger.info("savedTodo: ", savedTodo)

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
      Expires: urlExpiration,
      ContentType: "image/png"
  })
}
