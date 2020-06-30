import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { SQS } from 'aws-sdk'
import { AWSSqsConfig } from '../../config'
import { queueRepository } from './index'

/**
 * jest invocation for aws-sdk
 */
jest.mock('aws-sdk')

/**
 * function/constants  for  test suite
 */
const randomString = (size = 21) => {
  return crypto
    .randomBytes(size)
    .toString('base64')
    .slice(0, size)
}

const toMD5 = (str) => {
  return crypto
    .createHash('md5')
    .update(str)
    .digest().toString('base64')
}

const sqsMockObject = {
  sendMessage: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      MD5OfMessageBody: toMD5(randomString()),
      MD5OfMessageAttributes: toMD5(randomString()),
      MD5OfMessageSystemAttributes: toMD5(randomString()),
      MessageId: uuidv4(),
      SequenceNumber: 123
    })
  }),
  deleteMessage: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      $response: {
        error: null,
        retryCount: 0,
        requestId: uuidv4()
      }
    })
  }),
  receiveMessage: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Messages: [{
        MessageId: uuidv4(),
        ReceiptHandle: uuidv4(),
        MD5OfBody: toMD5(randomString()),
        Body: randomString(),
        Attributes: randomString(),
        MD5OfMessageAttributes: toMD5(randomString())
      }]
    })
  })
}
const messagePayload = { id: 1 }

/**
 * end of constants for test suite
 */

/**
 * begin of the test suite
 */
describe('sendMessage', () => {
  beforeEach(() => {
    SQS.mockReset()
  })

  test('basic send', async () => {
    SQS.mockImplementation(() => sqsMockObject)
    const sqs = new SQS({
      region: AWSSqsConfig.region,
      apiVersion: AWSSqsConfig.apiVersion
    })
    const queueRepositoryInstanteFn = queueRepository(sqs, 'queueUrl', 10)
    expect(await queueRepositoryInstanteFn.sendMessage(messagePayload)).toMatchObject({ SequenceNumber: 123 })
    expect(sqs.sendMessage).toHaveBeenCalled()
    expect(sqs.sendMessage).toHaveBeenCalledWith({
      QueueUrl: 'queueUrl',
      MessageBody: JSON.stringify(messagePayload)
    })
  })

  test('basic Send with no message Id', async () => {
    const sqsMockObjectWithOutId = {
      sendMessage: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
        })
      })
    }

    SQS.mockImplementation(() => sqsMockObjectWithOutId)
    const sqs = new SQS({
      region: AWSSqsConfig.region,
      apiVersion: AWSSqsConfig.apiVersion
    })
    const queueRepositoryInstanteFn = queueRepository(sqs, 'queueUrl', 10)
    await expect(queueRepositoryInstanteFn.sendMessage(messagePayload))
      .rejects.toEqual(new Error('No message id response!'))
  })

  test('basic Send with throw', async () => {
    const sqsMockObjectWithThrow = {
      sendMessage: jest.fn().mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('mock error'))
      })
    }

    SQS.mockImplementation(() => sqsMockObjectWithThrow)
    const sqs = new SQS({
      region: 'us-east-1'
    })
    const queueRepositoryInstanteFn = queueRepository(sqs, 'queueUrl', 10)
    await expect(queueRepositoryInstanteFn.sendMessage(messagePayload))
      .rejects.toEqual(new Error('mock error'))
  })
})

describe('receiveMessage', () => {
  beforeEach(() => {
    SQS.mockReset()
  })

  test('basic call', async () => {
    SQS.mockImplementation(() => sqsMockObject)
    const sqs = new SQS({
      region: AWSSqsConfig.region,
      apiVersion: AWSSqsConfig.apiVersion
    })
    const visibilityTimeout = 10
    const waitTimeSeconds = 5
    const queueRepositoryInstanteFn = queueRepository(sqs, 'queueUrl', 10)
    await expect(queueRepositoryInstanteFn.receiveMessage(10, 5))
      .resolves.toHaveLength(1)
    expect(sqs.receiveMessage).toHaveBeenCalled()
    expect(sqs.receiveMessage).toHaveBeenCalledWith(expect.objectContaining({
      MaxNumberOfMessages: 10,
      QueueUrl: 'queueUrl',
      VisibilityTimeout: visibilityTimeout,
      WaitTimeSeconds: waitTimeSeconds
    }))
  })

  test('basic call with default values', async () => {
    SQS.mockImplementation(() => sqsMockObject)
    const sqs = new SQS({
      region: AWSSqsConfig.region,
      apiVersion: AWSSqsConfig.apiVersion
    })
    const queueRepositoryInstanteFn = queueRepository(sqs, 'queueUrl')
    await expect(queueRepositoryInstanteFn.receiveMessage())
      .resolves.toHaveLength(1)
    expect(sqs.receiveMessage).toHaveBeenCalled()
    expect(sqs.receiveMessage).toHaveBeenCalledWith(expect.objectContaining({
      MaxNumberOfMessages: 1,
      QueueUrl: 'queueUrl',
      VisibilityTimeout: 20,
      WaitTimeSeconds: 10
    }))
  })

  test('basic call with no message received', async () => {
    const sqsMockObjectEmpty = {
      receiveMessage: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Messages: []
        })
      })
    }
    SQS.mockImplementation(() => sqsMockObjectEmpty)
    const sqs = new SQS({
      region: AWSSqsConfig.region,
      apiVersion: AWSSqsConfig.apiVersion
    })
    const visibilityTimeout = 10
    const waitTimeSeconds = 5
    const queueRepositoryInstanteFn = queueRepository(sqs, 'queueUrl', 10)
    await expect(queueRepositoryInstanteFn.receiveMessage(10, 5))
      .rejects.toThrow('No messages received')
    expect(sqs.receiveMessage).toHaveBeenCalled()
    expect(sqs.receiveMessage).toHaveBeenCalledWith(expect.objectContaining({
      MaxNumberOfMessages: 10,
      QueueUrl: 'queueUrl',
      VisibilityTimeout: visibilityTimeout,
      WaitTimeSeconds: waitTimeSeconds
    }))
  })
})

describe('deleteMessage', () => {
  beforeEach(() => {
    SQS.mockReset()
  })

  test('basic call', async () => {
    SQS.mockImplementation(() => sqsMockObject)
    const sqs = new SQS({
      region: AWSSqsConfig.region,
      apiVersion: AWSSqsConfig.apiVersion
    })
    const handlerId = randomString()
    const queueRepositoryInstanteFn = queueRepository(sqs, 'queueUrl', 10)
    await expect(queueRepositoryInstanteFn.deleteMessage(handlerId))
      .resolves.toMatchObject({
        error: null,
        retryCount: 0
      })
    expect(sqs.deleteMessage).toHaveBeenCalled()
    expect(sqs.deleteMessage).toHaveBeenCalledWith({
      QueueUrl: 'queueUrl',
      ReceiptHandle: handlerId
    })
  })

  test('reject call', async () => {
    const rejectMock = {
      deleteMessage: jest.fn().mockReturnValue({
        promise: jest.fn().mockRejectedValue({
          $response: {
            error: null,
            retryCount: 0,
            requestId: uuidv4()
          }
        })
      })
    }
    SQS.mockImplementation(() => rejectMock)
    const sqs = new SQS({
      region: AWSSqsConfig.region,
      apiVersion: AWSSqsConfig.apiVersion
    })
    const handlerId = randomString()
    const queueRepositoryInstanteFn = queueRepository(sqs, 'queueUrl', 10)
    await expect(queueRepositoryInstanteFn.deleteMessage(handlerId))
      .rejects.toThrow()
    expect(sqs.deleteMessage).toHaveBeenCalled()
    expect(sqs.deleteMessage).toHaveBeenCalledWith({
      QueueUrl: 'queueUrl',
      ReceiptHandle: handlerId
    })
  })
})
