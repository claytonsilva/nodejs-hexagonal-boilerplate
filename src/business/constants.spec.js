import { ETodoStatus, EPriority } from './constants'

describe('constants', () => {
  test('ETodoStatus', () => {
    expect(ETodoStatus.CANCELED).toBe('CANCELED')
    expect(ETodoStatus.CLOSED).toBe('CLOSED')
    expect(ETodoStatus.IN_PROGRESS).toBe('IN_PROGRESS')
    expect(ETodoStatus.NEW).toBe('NEW')
    expect(ETodoStatus.WAITING_TRANSMISSION).toBe('WAITING_TRANSMISSION')
  })
  test('EPriority', () => {
    expect(EPriority.HIGH).toBe('HIGH')
    expect(EPriority.LOW).toBe('LOW')
    expect(EPriority.MODERATE).toBe('MODERATE')
    expect(EPriority.URGENT).toBe('URGENT')
  })
})
