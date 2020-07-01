import { throwCustomError, CustomError, EClassError } from './errors'

/**
 * begin of the test suite
 */
describe('CustomError', () => {
  const methodPath = 'custom.path'

  test('basic instantiate', () => {
    const throwMessage = 'sample'
    const err = new CustomError(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(err.internalName).toBe(EClassError.INTERNAL)
    expect(err.message).toBe(throwMessage)
    expect(err.method).toBe(methodPath)
    expect(err.name).toBe('Error')
  })
})

describe('EClassError', () => {
  test('constants', () => {
    expect(EClassError.INTERNAL).toBe('INTERNAL')
    expect(EClassError.USER_ERROR).toBe('USER_ERROR')
  })
})

describe('throwCustomError', () => {
  const methodPath = 'custom.path'
  const toSpy = {
    throwCustomError
  }
  jest.spyOn(toSpy, 'throwCustomError')
  test('basic call', () => {
    const throwMessage = 'sample'
    const t = () => {
      toSpy.throwCustomError(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    }
    expect(t).toThrow()
    expect(toSpy.throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
  })

  test('call from CustomError', () => {
    const throwMessage = 'sample'
    const err = new CustomError(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    const t = () => {
      throwCustomError(err, 'doNotOverride', EClassError.USER_ERROR)
    }
    expect(t).toThrow()
  })
})
