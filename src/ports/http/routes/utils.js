// eslint-disable-next-line no-unused-vars
import { Response, NextFunction } from 'express'

/**
 * code imports
 */
import { CustomError, EClassError } from '../../../utils'

/**
 * @description Process response as promise
 *
 * @memberof ports/http/routes
 * @async
 * @function
 * @throws {CustomError}
 * @param {Promise} prom Promise to resolve
 * @param {Response} res Response from request
 * @param {NextFunction} res Response from request
 * @returns {Promise<Response>}
 */
export const response = async (prom, res, next) => {
  try {
    const result = await prom
    res.status(200).json(result)
  } catch (error) {
    switch (error.constructor) {
      case CustomError:
        switch (error.internalName) {
          case EClassError.INTERNAL:
            return res.status(500).json({ ...error })
          case EClassError.USER_ERROR:
            return res.status(400).json({ ...error })
          default:
            return res.status(500).json({ ...error })
        }
      default:
        return res.status(500).json(error.message || error)
    }
  }
}
