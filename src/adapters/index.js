/**
 * Adapters  Namespace.
 * @namespace adapters
 *
 *
 * @description this namespace control communication between business and state-machines
 */

/**
 * @typedef {Object} Adapter
 * @property {TodoAdapter} todo todo adapter instantied
 */

// eslint-disable-next-line no-unused-vars
import { DynamoRepositoryInstance } from '../ports/state-machines'
// code imports
import todoAdapterFactory,
// eslint-disable-next-line no-unused-vars
{ TodoAdapter } from './todo'

/**
 * @description dynamo repository for state machine
 *
 * @memberof ports/state-machines
 * @function
 * @param {Logger} escriba - Instance of escriba.
 * @param {DynamoRepositoryInstance} repository repository instatiated
 * @returns {Adapter}
 */
export const adapter = (escriba, repository) => {
  return {
    todo: todoAdapterFactory(escriba, repository)
  }
}
