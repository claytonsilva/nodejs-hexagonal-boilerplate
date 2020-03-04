/**
 * common treatments for errors handler
 *
 * this only one mutable object in all code
 */

/**
 * Object type for Custom errors
 * @typedef {Object} CustomError Object
 * @property {string} name - class of error from outside.
 * @property {string} internalName - class of error from inside (like BadRequest, etc.).
 * @property {string} methodPath - method origin of the error
 * @property {string} message - detail of error text
 * @property {string} stack - Stack call trace from base code call
 */
export class CustomError extends Error {
  /**
   * @constructs CustomError
   * @param {Error} err inherited error class
   * @param {string} methodPath  method origin of the error
   * @param {string} classError class of error from our code
   */
  constructor(err, methodPath, classError) {
    super()
    const { name, message, stack } = err

    // eslint-disable-next-line
    this.name = name
    // eslint-disable-next-line
    this.message = message
    // eslint-disable-next-line
    this.stack = stack
    // eslint-disable-next-line
    this.internalName = classError
    // eslint-disable-next-line
    this.method = methodPath
  }
}

/**
 * Enum for EClassError values.
 * @readonly
 * @memberof utils
 * @enum {string}
 */
export const EClassError = {
  INTERNAL: 'INTERNAL',
  USER_ERROR: 'USER_ERROR'
}

/**
 * Throw correct messagem error from origin in all levels
 * of the structure business -> adapter -> ports with correct CustomError
 * if the error is typeof CustomError
 * @memberof utils
 * @param {Error} err inherited error class
 * @param {string} methodPath  method origin of the error
 * @param {string} classError class of error from our code
 * @return {undefined}
 */
export const throwCustomError = (error, methodPath, classError) => {
  switch (error.constructor) {
    case CustomError:
      throw error
    default:
      throw new CustomError(error, methodPath, classError)
  }
}
