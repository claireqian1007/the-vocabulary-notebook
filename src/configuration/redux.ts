/* eslint-disable no-unused-vars */
import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { all, fork } from 'redux-saga/effects'

import wrdAutocompleteReducer, * as WordAutocompleteDuck from '../ducks/word-autocomplete'

export const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)) || compose

const ducks = [WordAutocompleteDuck]

const { STATE_FROM_SERVER } = (window as any)

export interface StateInterface {
  [WordAutocompleteDuck.namespace]: typeof WordAutocompleteDuck.initialState
}

export default function configureStore () {
  const sagaMiddleware = createSagaMiddleware()
  const middlewareEnhancer = applyMiddleware(sagaMiddleware, logger)
  const composedEnhancers = composeEnhancers(middlewareEnhancer)

  function * rootSaga () {
    yield all(ducks.map(({ watchSaga }) => fork(watchSaga)))
  }

  const store = createStore(combineReducers({
    [WordAutocompleteDuck.namespace]: wrdAutocompleteReducer
  }), STATE_FROM_SERVER || {}, composedEnhancers)

  sagaMiddleware.run(rootSaga)
  return store
}
