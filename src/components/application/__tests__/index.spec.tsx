import React from 'react'
import { shallow } from 'enzyme'

import NoteBookApplication from '../index'

describe('Given the NoteBookApplication Component', () => {
  it('should render with a success', () => {
    shallow(< NoteBookApplication />)
  })
})
