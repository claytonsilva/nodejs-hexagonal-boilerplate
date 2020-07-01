/**
 * Reference only imports (for documentation).
 */
// eslint-disable-next-line no-unused-vars
import { SQS, AWSError } from 'aws-sdk'
import R from 'ramda'
/**
 * Code imports.
 */
import { classError } from './constants'
import { throwCustomError } from '../../utils'

/**
 * AWS SQS custom methods.
 *
 */

/**
 * @description Send the message to sqs.
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {SQS} sqs instance of SQS sdk from aws.
 * @param {string} queueUrl url from sqs queue service from aws.
 * @returns {sendMessageReturn}
 */
export const sendMessage = (sqs, queueUrl) => async (body) => {
  const methodPath = 'ports.state-machines.aws.sqs.sendMessage'
  try {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(body)
    }
    const result = await sqs.sendMessage(params).promise()

    if (typeof result.MessageId === 'undefined') {
      throw new Error('No message id response!')
    }

    return result
  } catch (rejectResponse) {
    if (rejectResponse instanceof Error) {
      throwCustomError(rejectResponse, methodPath, classError.INTERNAL)
    } else {
      throwCustomError(new Error(`${rejectResponse.$response.error.code}: ${rejectResponse.$response.error.message}`), methodPath, classError.INTERNAL)
    }
  }
}

/**
 * @description receive the messages from sqs.
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {SQS} sqs instance of SQS sdk from aws.
 * @param {string} queueUrl url from sqs queue service from aws.
 * @param {number} maxNumberOfMessages max messages received from call command
 * @returns {receiveMessageReturn}
 */
export const receiveMessage = (sqs, queueUrl, maxNumberOfMessages) => async (visibilityTimeout, waitTimeSeconds) => {
  const methodPath = 'ports.state-machines.aws.sqs.receiveMessage'
  try {
    const messagesReceived = await sqs.receiveMessage({
      QueueUrl: queueUrl,
      VisibilityTimeout: visibilityTimeout || 20,
      MaxNumberOfMessages: maxNumberOfMessages || 1,
      WaitTimeSeconds: waitTimeSeconds || 10
    }).promise()

    if (R.isEmpty(messagesReceived) || R.isEmpty(messagesReceived.Messages)) {
      throw new Error('No messages received')
    }

    return messagesReceived.Messages
  } catch (rejectResponse) {
    if (rejectResponse instanceof Error) {
      throwCustomError(rejectResponse, methodPath, classError.INTERNAL)
    } else {
      throwCustomError(new Error(`${rejectResponse.$response.error.code}: ${rejectResponse.$response.error.message}`), methodPath, classError.INTERNAL)
    }
  }
}

/**
 * @description delete the message from sqs queue.
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {SQS} sqs instance of SQS sdk from aws.
 * @param {string} queueUrl url from sqs queue service from aws.
 * @returns {deleteMessageReturn}
 */
export const deleteMessage = (sqs, queueUrl) => async (receiptHandle) => {
  const methodPath = 'ports.state-machines.aws.sqs.deleteMessage'

  try {
    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle
    }
    const result = await sqs.deleteMessage(params).promise()

    return {
      error: result.$response.error,
      retryCount: result.$response.retryCount,
      requestId: result.$response.requestId
    }
  } catch (rejectResponse) {
    if (rejectResponse instanceof Error) {
      throwCustomError(rejectResponse, methodPath, classError.INTERNAL)
    } else {
      throwCustomError(new Error(`${rejectResponse.$response.error.code}: ${rejectResponse.$response.error.message}`), methodPath, classError.INTERNAL)
    }
  }
}

/**
 * exclusive specifications docs for complex types
 */

/**
* @typedef {Object} DeleteMessageOutput  output for deleteMessage command
* @property {AWSError} error  error of the call if exists
* @property {number} retryCount  number of retrys
* @property {string} requestId  id of aws request
*/

/**
 * This callback is displayed as part of the sendMessage function.
 *
 * @callback sendMessageReturn
 * @param {Object} body  body of message
 * @returns {Promise<SQS.SendMessageResult>} response from aws
 */

/**
 * This callback is displayed as part of the deleteMessage function.
 *
 * @callback deleteMessageReturn
 * @param {string} receiptHandle  handle of the message for identify in sqs system
 * @returns {Promise<DeleteMessageOutput>} response from aws
 */

/**
 * This callback is displayed as part of the receiveMessage function.
 *
 * @callback receiveMessageReturn
 * @param {number} visibilityTimeout time in seconds when message is visible
 * @param {number} waitTimeSeconds time in secods to wait queue for messages
 * @returns {Promise<SQS.MessageList>} response from aws
 */
