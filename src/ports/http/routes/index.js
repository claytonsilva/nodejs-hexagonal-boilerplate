/**
 * route http ports  Namespace.
 * @namespace ports/http/routes
 *
 *
 * @description this namespace is part of port http
 */

/**
 * Reference only imports (for documentation).
 */
// eslint-disable-next-line no-unused-vars
import { AdapterInstance } from '../../../adapters'
// eslint-disable-next-line no-unused-vars
import { Express } from 'express'
/**
 * Code imports.
 */
import { todoRouter } from './todo.router'

/**
 * @description Get route definitions.
 *
 * @memberof ports/http/routes
 * @function
 * @param {Logger} escriba instance of escriba
 * @param {AdapterInstance} adapter instantiated adapter
 * @param {Express} appp instantiated application express
 * @returns {getRoutesReturn}
 */
export const getRoutes = (escriba, adapter, app) => {
  // Route todos
  app.use('/api/v1/todos', todoRouter(escriba, adapter))

  return app
}

/**
 * This callback is displayed as part of the getRoutes function.
 *
 * @memberof ports/http/routes
 * @callback getRoutesReturn
 * @param {Express} app - instance of express application
 * @returns {Express} express application with routes injected
 */
