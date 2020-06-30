/**
 * Reference only imports (for documentation).
 */
// eslint-disable-next-line no-unused-vars
import { DynamoDB } from 'aws-sdk'

/**
 * Code imports.
 */
import { classError } from './constants'
import { CustomError } from '../../utils'

/**
 * AWS DynamoDB custom methods.
 */

/**
 * Get a document on table TableName in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {getDocumentReturn} Object searched from table
 */
export const getDocument = (dynamo, tableName) => async (key) => {
  try {
    const params = {
      TableName: tableName,
      Key: key
    }

    const result = await dynamo.get(params).promise()

    return result && result.Item ? result.Item : null
  } catch (error) {
    throw new CustomError(error, classError.INTERNAL, 'state-machines.aws.dynamo.getDocument')
  }
}

/**
 * Insert document in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {putDocumentReturn} Object searched from table
 */
export const putDocument = (dynamo, tableName) => async (item) => {
  try {
    const params = {
      TableName: tableName,
      Item: item
    }
    await dynamo.put(params).promise()

    return params.Item
  } catch (error) {
    throw new CustomError(error, classError.INTERNAL, 'state-machines.aws.dynamo.putDocument')
  }
}

/**
 * Update document in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {updateDocumentReturn} Object searched from table
 */
export const updateDocument = (dynamo, tableName) => async (key, updateExpression, expressionAttributeValues) => {
  try {
    const params = {
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: remapPrevixVariables(expressionAttributeValues),
      ReturnValues: 'ALL_NEW'
    }
    /**
       * @constant
       * @type {DynamoDB.UpdateItemOutput}
      */
    const output = await dynamo.update(params).promise()

    return output.Attributes
  } catch (error) {
    throw new CustomError(error, classError.INTERNAL, 'state-machines.aws.dynamo.updateDocument')
  }
}

/**
 * Delete a document on table TableName in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {deleteDocumentReturn} Object searched from table
 */
export const deleteDocument = (dynamo, tableName) => async (key) => {
  try {
    const params = {
      TableName: tableName,
      Key: key,
      ReturnValues: 'ALL_OLD'
    }

    const result = await dynamo.delete(params).promise()

    return result && result.Item ? result.Item : null
  } catch (error) {
    throw new CustomError(error, classError.INTERNAL, 'state-machines.aws.dynamo.getDocument')
  }
}

/**
 * @description Add ":" in all variables in prefix remaping the object
 *
 * @memberof state-machines
 * @function
 * @param {Object} obj object param in ExpressionAttributeValues
 * @returns {Object} object remaped
 */
export const remapPrevixVariables = (obj) => {
  return Object
    .keys(obj).reduce((prev, curr) => {
      return { ...prev, [`:${curr}`]: obj[curr] }
    }, {})
}

/***
 * type definitions for complex objects
 * this helps documentation
 */

/**
* This callback is displayed as part of the updateDocument (inner DynamoRepositoryInstance) function.
*
* @callback updateDocumentReturn
* @param {Object} key - object of keys table parameters to search
* @param {DynamoDB.UpdateExpression} updateExpression  dynamo notation of the update document expression without values to change
* @param {Object} expressionAttributeValues  values to be mapped in updateExpression expression
* @returns {Object} - object sended
*/

/**
* This callback is displayed as part of the getDocument (inner DynamoRepositoryInstance) function.
*
* @callback getDocumentReturn
* @param {Object} key - object of keys table parameters to search
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
