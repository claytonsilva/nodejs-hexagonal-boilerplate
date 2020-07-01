import { classError } from './constants'

describe('constants', () => {
  test('classError', () => {
    expect(classError.INTERNAL).toBe('INTERNAL')
  })
})
