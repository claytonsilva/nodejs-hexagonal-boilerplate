/**
 * Adapters  Namespace.
 * @namespace adapters
 *
 *
 * @description this namespace control communication between business and state-machines
 */

// eslint-disable-next-line no-unused-vars
import { DynamoRepositoryInstance } from '../ports/state-machines'
import {
  createTodo, getTodo, updateTodo, deleteTodo,
  // eslint-disable-next-line no-unused-vars
  getTodoReturn, createTodoReturn, deleteTodoReturn, updateTodoReturn
} from './todo'

/**
 * @description dynamo repository for state machine
 *
 * @memberof ports/state-machines
 * @function
 * @param {Logger} escriba - Instance of escriba.
 * @param {DynamoRepositoryInstance} repository repository instatiated
 * @returns {AdapterInstance}
 */
const adapter = (escriba, repository) => {
  return {
    createTodo: createTodo(escriba, repository),
    getTodo: getTodo(repository),
    updateTodo: updateTodo(escriba, repository),
    deleteTodo: deleteTodo(escriba, repository)
  }
}

export {
  adapter
}

/**
 * @typedef {Object} AdapterInstance
 *
 * @property {createTodoReturn} createTodo function to generate task (instantiated).
 * @property {getTodoReturn} getTodo function to get task by id (instantiated).
 * @property {updateTodoReturn} updateTodo function to update task  (instantiated).
 * @property {deleteTodoReturn} deleteTodo function to delete task (instantiated).
 */
