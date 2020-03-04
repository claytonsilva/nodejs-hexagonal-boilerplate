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
 * @returns {Object} Object searched from table
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
 * @returns {Object} Object searched from table
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
 * @returns {Object} Object searched from table
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
 * @returns {Object} Object searched from table
 */
export const deleteDocument = (dynamo, tableName) => async (key) => {
  try {
    const params = {
      TableName: tableName,
      Key: key
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
const remapPrevixVariables = (obj) => {
  return Object
    .keys(obj).reduce((prev, curr) => {
      return { ...prev, [`:${curr}`]: obj[curr] }
    }, {})
}
