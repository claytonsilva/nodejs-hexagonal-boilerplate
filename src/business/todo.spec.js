import { EPriority, ETodoStatus } from './constants'
import { validateCreateTodo, validateUpdateTodo, validateDeleteTodo } from './todo'
import { EClassError } from '../utils'
import { throwCustomError } from '../utils/errors'

/** mock error generation to validate signature */
jest.mock('../utils/errors')

throwCustomError.mockImplementation((error) => {
  throw error
})

describe('validateCreateTodo', () => {
  const methodPath = 'business.todo.validateCreateTodo'
  const validateCaseDefault = {
    taskDescription: 'test'
  }

  test('validate default case', () => {
    expect(validateCreateTodo(validateCaseDefault, 'testUser')).toMatchObject({
      ...validateCaseDefault,
      taskStatus: ETodoStatus.NEW,
      taskOwner: 'testUser',
      taskPriority: EPriority.LOW,
      taskOrder: 0
    })
  })

  const validateCasePriorityInvalid = {
    taskOrder: 1,
    taskDescription: 'test',
    taskPriority: 'INVALID'
  }

  test('validate invalid taskPriority', () => {
    const throwMessage = `invalid value for priority: got ${validateCasePriorityInvalid.taskPriority}`
    expect(() => {
      validateCreateTodo(validateCasePriorityInvalid, 'testUser')
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const validateCaseStatusInvalid = {
    taskOrder: 1,
    taskDescription: 'test',
    taskStatus: 'INVALID'
  }

  test('validate invalid taskStatus on create', () => {
    const throwMessage = `invalid value for status: got ${validateCaseStatusInvalid.taskStatus}`
    expect(() => {
      validateCreateTodo(validateCaseStatusInvalid, 'testUser')
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const validateNullDescription = {
    taskOrder: 1
  }

  test('validate null description on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about taskDescription'
    expect(() => {
      validateCreateTodo(validateNullDescription, 'testUser')
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const validateNullData = null

  test('validate null data on create', () => {
    const throwMessage = 'invalid entry on field data, missing information'
    expect(() => {
      validateCreateTodo(validateNullData, 'testUser')
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate null user on create', () => {
    const throwMessage = 'owner is missing'
    expect(() => {
      validateCreateTodo(validateCaseDefault)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })
})

describe('validateUpdateTodo', () => {
  const methodPath = 'business.todo.validateUpdateTodo'
  const defaultOriginalData = validateCreateTodo({
    taskPriority: EPriority.HIGH,
    taskDescription: 'updateDefault'
  }, 'owner')

  const validateCaseDefaultUpdate = {
    ...defaultOriginalData,
    taskStatus: ETodoStatus.IN_PROGRESS
  }

  test('validate null user on update', () => {
    const throwMessage = 'owner is missing'
    expect(() => {
      validateUpdateTodo(validateCaseDefaultUpdate, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate null originalData on update', () => {
    const throwMessage = 'no data for this id'
    expect(() => {
      validateUpdateTodo(validateCaseDefaultUpdate)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate data when is null for update', () => {
    const throwMessage = 'invalid entry on field data, missing information'
    expect(() => {
      validateUpdateTodo(null, defaultOriginalData, 'testUser')
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate normal update', () => {
    const validateCaseNormal = {
      ...defaultOriginalData,
      taskDescription: 'new description',
      taskStatus: ETodoStatus.IN_PROGRESS,
      taskPriority: EPriority.MODERATE
    }
    const updatedData = validateUpdateTodo(validateCaseNormal, defaultOriginalData, 'testUser')
    expect(updatedData)
      .toMatchObject({
        taskDescription: 'new description',
        taskStatus: ETodoStatus.IN_PROGRESS,
        taskPriority: EPriority.MODERATE
      })

    expect(updatedData.lastUpdateDate)
      .not.toBe(null)
    expect(updatedData)
      .not.toHaveProperty('taskOwner')
    expect(updatedData)
      .not.toHaveProperty('id')
  })
})

describe('validateDeleteTodo', () => {
  const methodPath = 'business.todo.validateDeleteTodo'
  const defaultOriginalData = validateCreateTodo({
    taskPriority: EPriority.HIGH,
    taskDescription: 'deleteDefault'
  }, 'owner')

  test('validate null user on delete', () => {
    const throwMessage = 'owner is missing'
    expect(() => {
      validateDeleteTodo(defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate null originalData on update', () => {
    const throwMessage = 'no data for this id'
    expect(() => {
      validateDeleteTodo(null, 'deleteUser')
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate normal delete', () => {
    expect(validateDeleteTodo(defaultOriginalData, 'testUser'))
      .toMatchObject(defaultOriginalData)
  })
})
