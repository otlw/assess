/* eslint-env jest */

import * as actions from './assessmentActions'

describe('assessmentActions', () => {
  test('should create an action to receive an assessor', () => {
    const address = '0x9f0D'
    const assessor = '0xf2a'
    const expectedAction = actions.receiveAssessor(address, assessor)
    expect(expectedAction).toEqual({
      type: actions.RECEIVE_ASSESSOR,
      address,
      assessor
    })
  })
})
