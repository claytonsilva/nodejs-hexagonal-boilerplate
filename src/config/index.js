/**
 * config  Namespace.
 * @namespace config
 *
 *
 * @description this namespace is a configuration of the project
 */
// eslint-disable-next-line no-unused-vars
import { Configuration as Log4jsConf } from 'log4js'

import R from 'ramda'

/**
 * general aws configuration
 * @memberof config
 */
const AWSConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  region: process.env.AWS_REGION,
  profile: process.env.AWS_PROFILE
}

/**
 * aws dynamodb configuration
 * @memberof config
 */
const AWSDynamoConfig = R.merge(
  AWSConfig,
  {
    region: process.env.AWS_DYNAMO_REGION,
    apiVersion: process.env.AWS_DYNAMO_APIVERSION || '2012-08-10',
    endpoint: process.env.AWS_DYNAMO_ENDPOINT
  }
)

/**
 * aws sqs configuration
 * @memberof config
 */
const AWSSqsConfig = R.merge(
  AWSConfig,
  {
    region: process.env.AWS_SQS_REGION,
    apiVersion: process.env.AWS_SQS_APIVERSION || '2012-11-05'
  }
)

/**
 * aws s3 configuration
 * @memberof config
 */
const AWSS3Config = R.merge(
  AWSConfig,
  {
    region: process.env.AWS_SQS_REGION,
    apiVersion: process.env.AWS_S3_APIVERSION || '2006-03-01'
  }
)

/**
 * moment configuration
 * @memberof config
 */
const momentConfig = {
  timezone: process.env.TIMEZONE || 'America/Sao_Paulo'
}

const envProdName = 'production'

/**
 * general application configuration
 * @memberof config
 */
const appConfig = {
  appName: process.env.APP_NAME || 'hexagonal-boilerplate',
  isProduction: process.env.NODE_ENV === envProdName,
  envName: process.env.NODE_ENV,
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
    categories: {
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
  envProdName,
  momentConfig
}
