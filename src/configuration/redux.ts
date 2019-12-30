import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { all, fork } from 'redux-saga/effects'

export const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)) || compose

const duckContext = (require as any).context('../ducks', true, /\/index.ts$/)

const ducks: any[] = duckContext.keys().map((duckFile: string) => {
  const { default: reducer, watchSaga, namespace } = duckContext(duckFile)
  return {
    reducer, watchSaga, namespace
  }
})

const { STATE_FROM_SERVER } = (window as any)

export default function configureStore () {
  const sagaMiddleware = createSagaMiddleware()
  const middlewareEnhancer = applyMiddleware(sagaMiddleware, logger)
  const composedEnhancers = composeEnhancers(middlewareEnhancer)

  function * rootSaga () {
    yield all(ducks.map(({ watchSaga }) => fork(watchSaga)))
  }

  const store = createStore(combineReducers(ducks.reduce((pre, { reducer, namespace }) => ({
    ...pre,
    [namespace]: reducer
  }), {})), STATE_FROM_SERVER || {}, composedEnhancers)

  sagaMiddleware.run(rootSaga)
  return store
}
