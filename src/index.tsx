import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Grommet } from 'grommet'

import './configuration/axios'
import configureStore from './configuration/redux'
import theme from './configuration/theme'
import NoteBookApplication from './router'

const store = configureStore()

ReactDOM.render((
  <Provider store={store}>
    <Grommet theme={theme}>
      < NoteBookApplication / >
    </Grommet>
  </Provider>
), document.getElementById('root'))
