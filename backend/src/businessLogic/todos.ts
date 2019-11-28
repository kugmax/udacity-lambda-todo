import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

import { TodoStore } from '../store/todoStore'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { getUserId } from '../auth/utils'

const todoStore = new TodoStore()

export async function getTodoByUserId(userId: string): Promise<TodoItem[]> {
  return await todoStore.getTodoByUserId(userId)
}

export async function createTodo(
  request: CreateTodoRequest
): Promise<TodoItem> {

  const itemId = uuid.v4()

  return await todoStore.createTodo({
    userId: "kugmax",//TODO: need use id from auth
    todoId: itemId,
    name: request.name,
    dueDate: request.dueDate,
    done: false,
    createdAt: new Date().toISOString(),
    attachmentUrl: "TODO: need impl"
  })
}

export async function updateTodo(
  todoId: string,
  request: UpdateTodoRequest
): Promise<TodoItem> {

  //TODO: getTodoById

  let savedTodo = await todoStore.getTodo(todoId)
  if (!savedTodo) {
    return null;
  }

  return await todoStore.updateTodo(
    todoId, 
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