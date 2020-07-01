// eslint-disable-next-line no-unused-vars
import { Logger } from 'log4js'
// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
// eslint-disable-next-line no-unused-vars
import { Todo } from '../../../business'
// eslint-disable-next-line no-unused-vars
import { Adapter } from '../../../adapters'
// eslint-disable-next-line no-unused-vars
import { ControllerTodoReturn } from './index'

/**
 * @description Get Task by id
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerTodoReturn}
 */
export const getTodo = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const todo = await adapter.todo.getTodo(req.params.id)
    return todo
  } catch (error) {
    escriba.error('api.controller.todo.getTodo', error)
    throw error
  }
}

/**
 * @description Create Task
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerTodoReturn}
 */
export const createTodo = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * TODO validate body
     */

    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const todo = await adapter.todo.createTodo(req.body.data, req.body.user)
    return todo
  } catch (error) {
    escriba.error('api.controller.todo.createTodo', error)
    throw error
  }
}

/**
 * @description Update Task
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerTodoReturn}
 */
export const updateTodo = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * TODO validate body
     */

    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const todo = await adapter.todo.updateTodo(req.params.id, req.body.data, req.body.user)
    return todo
  } catch (error) {
    escriba.error('api.controller.todo.updateTodo', error)
    throw error
  }
}

/**
 * @description Delete Task
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {controllerTodoReturn}
 */
export const deleteTodo = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const todo = await adapter.todo.deleteTodo(req.params.id, req.body.user)
    return todo
  } catch (error) {
    escriba.error('api.controller.todo.deleteTodo', error)
    throw error
  }
}
