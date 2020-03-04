/**
 * controller http ports  Namespace.
 * @namespace ports/http/controllers
 *
 *
 * @description this namespace is part of port http (controller section)
 */

export { createTodo, deleteTodo, getTodo, updateTodo } from './todo.controller'

/**
 * Complex callbacks documentation.
 *
 */

/**
 * This callback is displayed as part of the controllers function.
 *
 * @memberof ports/http/controllers
 * @callback controllerTodoReturn
 * @param {Request} request from api in express port
 * @param {Response} _res response to send to caller
 * @param {NextFunction} next method to call in middlewares architecture
 * @returns {Promise<Report>} Report.
 */
