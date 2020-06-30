import { EPriority, ETodoStatus } from './constants'
import { validateCreateTodo, validateUpdateTodo, validateDeleteTodo } from './todo'

describe('validateCreateTodo', () => {
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
    expect(() => {
      validateCreateTodo(validateCasePriorityInvalid, 'testUser')
    }).toThrow(`invalid value for priority: got ${validateCasePriorityInvalid.taskPriority}`)
  })

  const validateCaseStatusInvalid = {
    taskOrder: 1,
    taskDescription: 'test',
    taskStatus: 'INVALID'
  }

  test('validate invalid taskStatus on create', () => {
    expect(() => {
      validateCreateTodo(validateCaseStatusInvalid, 'testUser')
    }).toThrow(`invalid value for status: got ${validateCaseStatusInvalid.taskStatus}`)
  })

  const validateNullDescription = {
    taskOrder: 1
  }

  test('validate null description on create', () => {
    expect(() => {
      validateCreateTodo(validateNullDescription, 'testUser')
    }).toThrow('invalid entry on field data, missing information')
  })

  const validateNullData = null

  test('validate null data on create', () => {
    expect(() => {
      validateCreateTodo(validateNullData, 'testUser')
    }).toThrow('invalid entry on field data, missing information')
  })

  test('validate null user on create', () => {
    expect(() => {
      validateCreateTodo(validateCaseDefault)
    }).toThrow('owner is missing')
  })
})

describe('validateUpdateTodo', () => {
  const defaultOriginalData = validateCreateTodo({
    taskPriority: EPriority.HIGH,
    taskDescription: 'updateDefault'
  }, 'owner')

  const validateCaseDefaultUpdate = {
    ...defaultOriginalData,
    taskStatus: ETodoStatus.IN_PROGRESS
  }

  test('validate null user on update', () => {
    expect(() => {
      validateUpdateTodo(validateCaseDefaultUpdate, defaultOriginalData)
    }).toThrow('owner is missing')
  })

  test('validate null originalData on update', () => {
    expect(() => {
      validateUpdateTodo(validateCaseDefaultUpdate)
    }).toThrow('no data for this id')
  })

  const validateCasePriorityInvalid = {
    ...defaultOriginalData,
    taskPriority: 'INVALID'
  }

  test('validate invalid taskPriority on update', () => {
    expect(() => {
      validateUpdateTodo(validateCasePriorityInvalid, defaultOriginalData, 'testUser')
    }).toThrow(`invalid value for priority: got ${validateCasePriorityInvalid.taskPriority}`)
  })

  const validateCaseStatusInvalid = {
    ...defaultOriginalData,
    taskStatus: 'INVALID'
  }

  test('validate invalid taskStatus on update', () => {
    expect(() => {
      validateUpdateTodo(validateCaseStatusInvalid, defaultOriginalData, 'testUser')
    }).toThrow(`invalid value for status: got ${validateCaseStatusInvalid.taskStatus}`)
  })

  test('validate data when is null for update', () => {
    expect(() => {
      validateUpdateTodo(null, defaultOriginalData, 'testUser')
    }).toThrow('invalid entry on field data, missing information')
  })

  const validateCaseNullDescription = {
    ...defaultOriginalData,
    taskDescription: null
  }

  test('validate null description when update', () => {
    expect(() => {
      validateUpdateTodo(validateCaseNullDescription, defaultOriginalData, 'testUser')
    }).toThrow('invalid entry on field data, missing information about taskDescription')
  })

  const validateCaseNormal = {
    ...defaultOriginalData,
    taskDescription: 'new description',
    taskStatus: ETodoStatus.IN_PROGRESS,
    taskPriority: EPriority.MODERATE
  }

  test('validate normal update', () => {
    expect(validateUpdateTodo(validateCaseNormal, defaultOriginalData, 'testUser'))
      .toMatchObject({
        taskDescription: 'new description',
        taskStatus: ETodoStatus.IN_PROGRESS,
        taskPriority: EPriority.MODERATE
      })

    expect(validateUpdateTodo(validateCaseNormal, defaultOriginalData, 'testUser').lastUpdateDate)
      .not.toBe(null)
  })
})

describe('validateDeleteTodo', () => {
  const defaultOriginalData = validateCreateTodo({
    taskPriority: EPriority.HIGH,
    taskDescription: 'deleteDefault'
  }, 'owner')

  test('validate null user on delete', () => {
    expect(() => {
      validateDeleteTodo(defaultOriginalData)
    }).toThrow('owner is missing')
  })

  test('validate null originalData on update', () => {
    expect(() => {
      validateDeleteTodo(null, 'deleteUser')
    }).toThrow('no data for this id')
  })

  test('validate normal delete', () => {
    expect(validateDeleteTodo(defaultOriginalData, 'testUser'))
      .toMatchObject(defaultOriginalData)
  })
})
