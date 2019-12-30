/* eslint-disable no-unused-vars */
import { runSaga, SagaIterator } from 'redux-saga'
import { Action } from 'redux'

export default async function recordSaga<T extends Action> (
  sage: (params: T) => SagaIterator,
  initialAction: T,
  state = {}
) {
  const dispatched: T[] = []
  await runSaga(
    {
      dispatch: (action: T) => dispatched.push(action),
      getState: () => state
    },
    sage,
    initialAction
  ).toPromise()
  return dispatched
}
