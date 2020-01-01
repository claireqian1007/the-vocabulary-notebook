import React from 'react'
import { shallow } from 'enzyme'

import QuickAddPage from '../'

describe('Given the QuickAddPage', () => {
  it('should match the snapshot by default props', () => {
    const wrapper = shallow(<QuickAddPage />)
    expect(wrapper).toMatchSnapshot()
  })
})
