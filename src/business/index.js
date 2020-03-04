/**
 * Business  Namespace.
 * @namespace business
 *
 *
 * @description this namespace control all business control of the solution
 */
/**
 * code imports
 */
// eslint-disable-next-line no-unused-vars
import { ETodoStatus, EPriority } from './constants'

/**
 * @typedef {Object} TodoKey
 * @property {string} id  id of the task
 */

/**
* @typedef {Object} Todo
* @property {string} id  id of the task
* @property {number} taskOrder  order of activity
* @property {string} taskDescription description of taks
* @property {user} taskOwner of the task
* @property {ETodoStatus} taskStatus status of report
* @property {EPriority} taskPriority priority of report
* @property {string} creationDate datetime of creation
* @property {string} lastUpdateDate datetime of the last update
*/

/**
* @typedef {Object} MutateTodoInput  object to input in mutations
* @property {number} taskOrder  order of activity
* @property {string} taskDescription description of taks
* @property {ETodoStatus} taskStatus status of report
* @property {EPriority} taskPriority priority of report
*/

/**
* @typedef {Object} MutateTodoOutput  object to input in mutations
* @property {number} taskOrder  order of activity
* @property {string} taskDescription description of taks
* @property {ETodoStatus} taskStatus status of report
* @property {EPriority} taskPriority priority of report
* @property {string} creationDate datetime of creation
* @property {string} lastUpdateDate datetime of the last update
*/
