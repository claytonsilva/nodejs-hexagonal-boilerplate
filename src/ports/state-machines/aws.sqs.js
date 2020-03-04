/**
 * Reference only imports (for documentation).
 */
// eslint-disable-next-line no-unused-vars
import { SQS } from 'aws-sdk'
/**
 * Code imports.
 */
import { classError } from './constants'
import { CustomError } from '../../utils'

/**
 * AWS SQS custom methods.
 *
 */

/**
 * Get a document on table TableName in the DynamoDB.
 * @description Send the message to sqs.
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {SQS} sqs instance of SQS sdk from aws.
 * @param {string} queueUrl url from sqs queue service from aws.
 * @returns {Promise<SQS.SendMessageResult>} response from aws
 */
export const sendMessage = (sqs, queueUrl) => async (body) => {
  try {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(body)
    }
    const result = await sqs.sendMessage(params).promise()

    if (typeof result.MessageId === 'undefined') {
      throw new CustomError(
        new Error('No message id response!'),
        classError.INTERNAL,
        'state-machines.aws.sqs.sendMessage'
      )
    }

    return result
  } catch (error) {
    if (error instanceof CustomError) {
      throw error
    }
    throw new CustomError(error, classError.INTERNAL, 'state-machines.aws.sqs.sendMessage')
  }
}
