import { createRoute, z } from '@hono/zod-openapi'

const TaskSchema = z
  .object({
    id: z.string().openapi({ example: '12345' }),
    title: z.string().openapi({ example: 'Buy groceries' }),
    description: z.string().openapi({ example: 'Milk, Bread, Butter' }).optional(),
    completed: z.boolean(),
  })
  .openapi('Task')

const TaskInputSchema = z
  .object({
    title: z.string().openapi({ example: 'Buy groceries' }),
    description: z.string().openapi({ example: 'Milk, Bread, Butter' }).optional(),
    completed: z.boolean().optional(),
  })
  .openapi('TaskInput')

export const getTasksRoute = createRoute({
  tags: [],
  method: 'get',
  path: '/tasks',
  summary: 'List Tasks',
  description: 'Retrieve a list of all tasks.',
  responses: {
    200: {
      description: 'A JSON array of task objects.',
      content: { 'application/json': { schema: z.array(TaskSchema) } },
    },
  },
})

export const postTasksRoute = createRoute({
  tags: [],
  method: 'post',
  path: '/tasks',
  summary: 'Create Task',
  description: 'Create a new task.',
  request: {
    body: { required: true, content: { 'application/json': { schema: TaskInputSchema } } },
  },
  responses: {
    201: {
      description: 'Task created successfully.',
      content: { 'application/json': { schema: TaskSchema } },
    },
  },
})

export const getTasksTaskIdRoute = createRoute({
  tags: [],
  method: 'get',
  path: '/tasks/{taskId}',
  summary: 'Get Task',
  description: 'Retrieve a single task by its ID.',
  request: { params: z.object({ taskId: z.string() }) },
  responses: {
    200: {
      description: 'Task details retrieved successfully.',
      content: { 'application/json': { schema: TaskSchema } },
    },
    404: { description: 'Task not found.' },
  },
})

export const putTasksTaskIdRoute = createRoute({
  tags: [],
  method: 'put',
  path: '/tasks/{taskId}',
  summary: 'Update Task',
  description: 'Update an existing task by its ID.',
  request: {
    body: { required: true, content: { 'application/json': { schema: TaskInputSchema } } },
    params: z.object({ taskId: z.string() }),
  },
  responses: {
    200: {
      description: 'Task updated successfully.',
      content: { 'application/json': { schema: TaskSchema } },
    },
    404: { description: 'Task not found.' },
  },
})

export const deleteTasksTaskIdRoute = createRoute({
  tags: [],
  method: 'delete',
  path: '/tasks/{taskId}',
  summary: 'Delete Task',
  description: 'Delete a task by its ID.',
  request: { params: z.object({ taskId: z.string() }) },
  responses: {
    204: { description: 'Task deleted successfully. No content returned.' },
    404: { description: 'Task not found.' },
  },
})
