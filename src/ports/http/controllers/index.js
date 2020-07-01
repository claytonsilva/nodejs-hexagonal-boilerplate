/**
 * controller http ports  Namespace.
 * @namespace ports/http/controllers
 *
 *
 * @description this namespace is part of port http (controller section)
 */
// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'

export { createTodo, deleteTodo, getTodo, updateTodo } from './todo.controller'

/**
 * Complex callbacks documentation.
 *
 */

/**
 * This callback is displayed as part of the controllers function.
 *
 * @memberof ports/http/controllers
 * @callback ControllerTodoReturn<T>
 * @param {Request} request from api in express port
 * @param {Response} _res response to send to caller
 * @param {NextFunction} next method to call in middlewares architecture
 * @returns {Promise<T>} Report.
 */
