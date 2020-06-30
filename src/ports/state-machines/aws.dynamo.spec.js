import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { databaseRepository } from './index'
import { remapPrevixVariables } from './aws.dynamo'
import { v4 as uuidv4 } from 'uuid'

/**
 * jest invocation for aws-sdk
 */
jest.mock('aws-sdk/clients/dynamodb')

const dynamo = new DocumentClient()
const tableName = 'mockTable'
const repoInstance = databaseRepository(dynamo, 'mockTable')

const dynamoMockObject = {
  get: (Params) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Item: {
        id: Params.Key.id,
        description: 'mockResult'
      }
    })
  }),
  put: (Params) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue(Params.Item)
  }),
  update: (Params) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Attributes: {
        id: Params.Key.id,
        description: 'mockResult'
      }
    })
  }),
  delete: (Params) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Item: {
        id: Params.Key.id,
        description: 'mockResult'
      }
    })
  })
}

describe('getDocument', () => {
  beforeEach(() => {
    DocumentClient.mockReset()
  })
  test('default case', async () => {
    dynamo.get.mockImplementationOnce((Params) => dynamoMockObject.get(Params)())
    const newId = uuidv4()

    await expect(repoInstance.getDocument({ id: newId }))
      .resolves.toMatchObject({
        id: newId,
        description: 'mockResult'
      })
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })

  test('error', async () => {
    dynamo.get.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('invalid id'))
    }))
    const newId = uuidv4()

    await expect(repoInstance.getDocument({ id: newId })).rejects.toThrow('invalid id')
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })

  test('null result.Item', async () => {
    dynamo.get.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: null })
    }))
    const newId = uuidv4()

    await expect(repoInstance.getDocument({ id: newId })).resolves.toBe(null)
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })
})

describe('putDocument', () => {
  beforeEach(() => {
    DocumentClient.mockReset()
  })
  test('default case', async () => {
    dynamo.put.mockImplementationOnce((Params) => dynamoMockObject.put(Params)())
    const newId = uuidv4()

    await expect(repoInstance.putDocument({
      id: newId,
      description: 'mockResult'
    }))
      .resolves.toMatchObject({
        id: newId,
        description: 'mockResult'
      })
    expect(dynamo.put).toHaveBeenCalled()
    expect(dynamo.put).toHaveBeenCalledWith({
      Item: {
        id: newId,
        description: 'mockResult'
      },
      TableName: tableName
    })
  })

  test('error', async () => {
    dynamo.put.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('invalid entry'))
    }))
    const newId = uuidv4()

    await expect(repoInstance.putDocument({
      id: newId,
      description: 'mockResult'
    })).rejects.toThrow('invalid entry')
    expect(dynamo.put).toHaveBeenCalled()
    expect(dynamo.put).toHaveBeenCalledWith({
      Item: {
        id: newId,
        description: 'mockResult'
      },
      TableName: tableName
    })
  })
})

describe('updateDocument', () => {
  beforeEach(() => {
    DocumentClient.mockReset()
  })
  test('default case', async () => {
    dynamo.update.mockImplementationOnce((Params) => dynamoMockObject.update(Params)())
    const newId = uuidv4()

    await expect(repoInstance.updateDocument(
      {
        id: newId
      },
      'description := :description',
      { description: 'mockResult' }
    ))
      .resolves.toMatchObject({
        id: newId,
        description: 'mockResult'
      })
    expect(dynamo.update).toHaveBeenCalled()
    expect(dynamo.update).toHaveBeenCalledWith({
      Key: { id: newId },
      TableName: tableName,
      UpdateExpression: 'description := :description',
      ExpressionAttributeValues: remapPrevixVariables({ description: 'mockResult' }),
      ReturnValues: 'ALL_NEW'
    })
  })

  test('error', async () => {
    dynamo.update.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('invalid entry'))
    }))
    const newId = uuidv4()

    await expect(repoInstance.updateDocument(
      {
        id: newId
      },
      'description := :description',
      { description: 'mockResult' }
    )).rejects.toThrow('invalid entry')
    expect(dynamo.update).toHaveBeenCalled()
    expect(dynamo.update).toHaveBeenCalledWith({
      Key: { id: newId },
      TableName: tableName,
      UpdateExpression: 'description := :description',
      ExpressionAttributeValues: remapPrevixVariables({ description: 'mockResult' }),
      ReturnValues: 'ALL_NEW'
    })
  })
})

describe('deleteDocument', () => {
  beforeEach(() => {
    DocumentClient.mockReset()
  })
  test('default case', async () => {
    dynamo.delete.mockImplementationOnce((Params) => dynamoMockObject.delete(Params)())
    const newId = uuidv4()

    await expect(repoInstance.deleteDocument({ id: newId }))
      .resolves.toMatchObject({
        id: newId,
        description: 'mockResult'
      })
    expect(dynamo.delete).toHaveBeenCalled()
    expect(dynamo.delete).toHaveBeenCalledWith({ Key: { id: newId }, ReturnValues: 'ALL_OLD', TableName: tableName })
  })

  test('error', async () => {
    dynamo.delete.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('invalid id'))
    }))
    const newId = uuidv4()

    await expect(repoInstance.deleteDocument({ id: newId })).rejects.toThrow('invalid id')
    expect(dynamo.delete).toHaveBeenCalled()
    expect(dynamo.delete).toHaveBeenCalledWith({ Key: { id: newId }, ReturnValues: 'ALL_OLD', TableName: tableName })
  })

  test('null result.Item', async () => {
    dynamo.delete.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: null })
    }))
    const newId = uuidv4()

    await expect(repoInstance.deleteDocument({ id: newId })).resolves.toBe(null)
    expect(dynamo.delete).toHaveBeenCalled()
    expect(dynamo.delete).toHaveBeenCalledWith({ Key: { id: newId }, ReturnValues: 'ALL_OLD', TableName: tableName })
  })
})
