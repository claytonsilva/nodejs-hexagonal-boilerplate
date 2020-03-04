import AWS from 'aws-sdk'

import { appConfig, AWSDynamoConfig } from '../../config'
import { adapter } from '../../adapters/'
import { handleLogger } from '../logger/logger'
import { databaseRepository } from '../state-machines'

/**
 * Protocol handler.
 * more about: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * @memberof ports/aws/lambda
 * @param {*} event event object information from lambda (https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-s3.html)
 * @param {*} context information from direct call with params
 * @param {*} circuit breaker function
 */
export const handler = async (event, context, exit) => {
  const appName = 'protocol'
  const isProduction = process.env.ENV_NAME === 'production'
  const envName = isProduction ? 'production' : 'staging'

  // Escriba configuration.
  const escriba = handleLogger(appName, envName)

  // AWS Dynamo configuration.
  AWS.config.update(AWSDynamoConfig)
  const dynamo = new AWS.DynamoDB.DocumentClient()

  // inject repositories
  const databaseRepoInstance = databaseRepository(dynamo, appConfig.report.tableName)
  const adapterInstance = adapter(escriba, databaseRepoInstance, null)

  const getTodo = async () => {
    try {
      const { id } = event.arguments
      const result = await adapterInstance.getTodo(id)
      escriba.info('handler.get', `Get the task: ${id}`)
      return result
    } catch (error) {
      escriba.error('handler.generate', { ...error })
      throw error
    }
  }

  const createTodo = async () => {
    try {
      const { user } = event.arguments
      const result = await adapterInstance.createTodo(event.arguments.data, user)
      escriba.info('handler.generate', `Generated the task: ${result.id}`, result)
      return result
    } catch (error) {
      escriba.error('handler.generate', { ...error })
      throw error
    }
  }

  const updateTodo = async () => {
    try {
      const { id, user } = event.arguments
      const result = await adapterInstance.updateTodo(id, event.arguments.data, user)
      escriba.info('handler.generate', `Generated the task: ${result.id}`, result)
      return result
    } catch (error) {
      escriba.error('handler.generate', { ...error })
      throw error
    }
  }

  const deleteTodo = async () => {
    try {
      const { id } = event.arguments
      const result = await adapterInstance.deleteTodo(id)
      escriba.info('handler.get', `Delete the task: ${id}`)
      return result
    } catch (error) {
      escriba.error('handler.generate', { ...error })
      throw error
    }
  }

  switch (event.field) {
    case 'getTodo':
      return getTodo()
    case 'createTodo':
      return createTodo()
    case 'updateTodo':
      return updateTodo()
    case 'deleteTodo':
      return deleteTodo()
    default:
      return getTodo()
  }
}
