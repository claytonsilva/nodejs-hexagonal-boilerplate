/**
 * config  Namespace.
 * @namespace config
 *
 *
 * @description this namespace is a configuration of the project
 */

import { config } from 'dotenv'
import R from 'ramda'
config()

const AWSConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  region: process.env.AWS_REGION
}

const AWSDynamoConfig = R.merge(
  AWSConfig,
  {
    region: process.env.AWS_DYNAMO_REGION,
    apiVersion: process.env.AWS_DYNAMO_APIVERSION || '2012-08-10',
    endpoint: process.env.AWS_DYNAMO_ENDPOINT
  }
)

const AWSSqsConfig = R.merge(
  AWSConfig,
  {
    region: process.env.AWS_SQS_REGION || 'us-west-2',
    apiVersion: process.env.AWS_SQS_APIVERSION || '2012-11-05'
  }
)

const AWSS3Config = R.merge(
  AWSConfig,
  {
    region: process.env.AWS_SQS_REGION || 'us-west-2',
    apiVersion: process.env.AWS_S3_APIVERSION || '2006-03-01'
  }
)

const momentConfig = {
  timezone: process.env.TIMEZONE || 'America/Sao_Paulo'
}

const appConfig = {
  appName: process.env.APP_NAME || 'hexagonal-boilerplate',
  isProduction: process.env.ENV_NAME === 'production',
  envName: process.env.ENV_NAME || 'staging',
  todo: {
    tableName: process.env.TODO_TABLE_NAME || 'todos',
    queueUrl: process.env.AWS_DYNAMO_TODO_TABLE_NAME || 'todo'
  }
}

/**
 * logger configuration fixed for all jobs
 * @memberof config
 */
const escribaConf = {
  sensitiveConf: {
    password: {
      paths: ['message.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  },
  log4jsConf: {
    appenders: {
      out: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '[%d] %m'
        }
      }
    },
    'categories': {
      default: {
        appenders: [
          'out'
        ],
        level: 'info'
      }
    }
  }
}

export {
  appConfig,
  AWSConfig,
  AWSDynamoConfig,
  AWSS3Config,
  AWSSqsConfig,
  escribaConf,
  momentConfig
}
