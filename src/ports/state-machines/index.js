/**
 * StateMachines  Namespace.
 * @namespace ports/state-machines
 *
 *
 * @description this namespace control state-machine api methods
 */

/**
 * reference doc only imports
 */
// eslint-disable-next-line no-unused-vars
import { DynamoDB } from 'aws-sdk'

/**
 * library references
 */
import { sendMessage } from './aws.sqs'
import { updateDocument, getDocument, putDocument, deleteDocument } from './aws.dynamo'

/***
 * repositories
 * dynamo and sqs are used in repositories
 */

/**
 * @description dynamo repository for state machine
 *
 * @memberof ports/state-machines
 * @function
 * @param {DynamoDB.DocumentClient} dynamo instance of dynamo api
 * @returns {DynamoRepositoryInstance} instance of repository for database
 */
export const databaseRepository = (dynamo, tableName) => {
  return {
    updateDocument: updateDocument(dynamo, tableName),
    getDocument: getDocument(dynamo, tableName),
    putDocument: putDocument(dynamo, tableName),
    deleteDocument: deleteDocument(dynamo, tableName)
  }
}

/**
 * @description queue repository for state machine
 *
 * @memberof ports/state-machines
 * @function
 * @param {sqs} sqs instance of SQS
 * @param {string} queueUrl queue url string
 * @returns {QueueRepositoryInstance}
 */
export const queueRepository = (sqs, queueUrl) => {
  return {
    sendMessage: sendMessage(sqs, queueUrl)
  }
}

/***
 * type definitions for complex objects
 * this helps documentation
 */

/**
 * @typedef {Object} QueueRepositoryInstance
 * @property {sendMessageReturn} sendMessage function to send message to sqs (instantiated).
 */

/**
 * This callback is displayed as part of the sendMessage (inner QueueRepositoryInstance) function.
 *
 * @callback sendMessageReturn
 * @param {Object} body - message to delivery in JSON
 * @returns {Object} - object sended
 */

/**
 * @typedef {Object} DynamoRepositoryInstance
 *
 * @property {updateDocumentReturn} updateDocument function to update existing document (instantiated).
 * @property {getDocumentReturn} getDocument function to get existing document (instantiated).
 * @property {putDocumentReturn} putDocument function to create existing document (instantiated).
 * @property {deleteDocumentReturn} deleteDocument function to delete existing document (instantiated).
 */

/**
* This callback is displayed as part of the updateDocument (inner DynamoRepositoryInstance) function.
*
* @callback updateDocumentReturn
* @param {Object} key - object of keys table parameters to search
* @returns {Object} - object sended
*/

/**
* This callback is displayed as part of the getDocument (inner DynamoRepositoryInstance) function.
*
* @callback getDocumentReturn
* @param {Object} key - object of keys table parameters to search
* @param {DynamoDB.UpdateExpression} updateExpression  dynamo notation of the update document expression without values to change
* @param {Object} expressionAttributeValues  values to be mapped in updateExpression expression
* @returns {Object} - object updated from state-machine
*/

/**
* This callback is displayed as part of the putDocument (inner DynamoRepositoryInstance) function.
*
* @callback putDocumentReturn
* @param {Object} item - object to persist
*/

/**
* This callback is displayed as part of the deleteDocument (inner DynamoRepositoryInstance) function.
*
* @callback deleteDocumentReturn
* @param {Object} key - key of the data
*/
