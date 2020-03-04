/**
 * route http ports  Namespace.
 * @namespace ports/http
 *
 *
 * @description this namespace is part of port http
 */

import { config } from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import { config as AWSConfig, DynamoDB } from 'aws-sdk'
import { databaseRepository } from '../state-machines'
import { adapter } from '../../adapters'
import { appConfig, AWSDynamoConfig } from '../../config'
import { getRoutes } from './routes/index'
import { handleLogger } from '../logger'

config()

// Setting app
const _app = express()

// Escriba
const escriba = handleLogger(appConfig.appName, appConfig.envName)

// AWS Dynamo configuration.
AWSConfig.update(AWSDynamoConfig)
const dynamo = new DynamoDB.DocumentClient()

// inject repositories
const databaseRepoInstance = databaseRepository(dynamo, appConfig.todo.tableName)
const adapterInstance = adapter(escriba, databaseRepoInstance)

_app.use(bodyParser.json({ limit: '50mb' }))
_app.use(bodyParser.urlencoded({ extended: false }))

export const app = getRoutes(escriba, adapterInstance, _app)
