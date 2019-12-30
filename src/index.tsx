import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import NoteBookApplication from './components/application'
import './configuration/axios'
import configureStore from './configuration/redux'

const store = configureStore()

ReactDOM.render((
  <Provider store={store}>
    < NoteBookApplication / >
  </Provider>
), document.getElementById('root'))
