import cuid from 'cuid'
import escriba from 'escriba'
// eslint-disable-next-line no-unused-vars
import { configure as log4jsConfigure, Log4js } from 'log4js'

import { escribaConf } from '../../config'

/**
 * xDevel microservices - escriba functions
 *
 * the objetive of this js module is
 *
 * - easy to test
 * - easy to inject mock in more than one level
 * - immutability and functional programming patterns
 */

/**
 * zero config log4js for non-default configuration and bootstrap log4jsInstance
 *
 * @memberof ports/logger
 * @param {Object} log4jsConf
 * @returns {*}
 */
const log4jsConfigured = (log4jsConf) => log4jsConfigure(log4jsConf).getLogger

/**
 * instantiate logger elements for middleware
 *
 * @memberof ports/logger
 * @param {Log4js} log4jsLogger - funciont getLogger from log4js vendor
 * @param {*} escribaConstructor - function for construct escriba instance
 * @param {*} sensitiveConf - json for sensitive properties from escriba
 * @param {string} appName - application name
 * @returns Logger
 */
const configureLogger = (log4jsLogger, escribaConstructor, sensitiveConf, appName) => {
  const escribaConfig = {
    loggerEngine: log4jsLogger(),
    service: appName,
    sensitive: sensitiveConf
  }

  const { logger } = escribaConstructor(escribaConfig)

  return logger
}

/**
 * Configure logger for all handlers.
 *
 * @memberof ports/logger
 * @param {string} appName - name of application
 * @param {string} envName - environment of the application
 * @returns {handleLoggerReturn}
 */
const handleLogger = (appName, envName) => {
  const logger = configureLogger(log4jsConfigured(escribaConf.log4jsConf), escriba, escribaConf.sensitiveConf, appName)
  const info = (method, message) => logger.info(message, { id: cuid(), from: { appName, method, envName } })
  const error = (method, message) => logger.info(message, { id: cuid(), from: { appName, method, envName } })

  return {
    logger,
    info,
    error
  }
}

export { handleLogger }

/**
 * Complex callbacks documentation.
 *
 */

/**
 * This callback is displayed as part of the handleLogger function.
 *
 * @memberof ports/logger
 * @callback handleLoggerReturn
 * @param {*} logger instance of the escriba
 * @param {handleLoggerMessageReturn} info  syntax suggar for logger.info method
 * @param {handleLoggerMessageReturn} error  syntax suggar for logger.error method
 * @returns {undefined}
 */

/**
* This callback is displayed as part of the handleLoggerReturn function.
*
* @memberof ports/logger
* @callback handleLoggerMessageReturn
* @param {LoggerFuncParams} method info for method who call the log method
* @param {LoggerFuncParams} message message of the log
* @returns {undefined}
*/

/**
 * @memberof ports/logger
 * @typedef {Object} LoggerFuncParams
 * @property method: string
 * @property message: string
 */
