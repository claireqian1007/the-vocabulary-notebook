// eslint-disable-next-line no-unused-vars
import { AnyAction } from 'redux'
import { createRoutine } from 'redux-saga-routines'
import { call, put, takeLatest } from 'redux-saga/effects'

import { getWordAutocompleteList } from '../../services'
import { FETCH_WORD_AUTOCOMPLETE_ERROR } from '../../utils/errors'

export const WordAutocompleteRoutine = createRoutine('WORD_AUTOCOMPLETE')

interface StateInterface {
  loading: boolean,
  suggestions: string[],
  error?: string
}

export const initialState: StateInterface = {
  loading: false,
  suggestions: [],
  error: undefined
}

export const isLoading: (state: StateInterface) => boolean = ({ loading }) => loading
export const getSuggestions: (state: StateInterface) => string[] = ({ suggestions }) => suggestions
export const getError: (state: StateInterface) => string | undefined = ({ error }) => error

export default function reducer (state = initialState, action: AnyAction): StateInterface {
  switch (action.type) {
    case WordAutocompleteRoutine.TRIGGER:
      return initialState
    case WordAutocompleteRoutine.REQUEST:
      return {
        ...state,
        loading: true
      }
    case WordAutocompleteRoutine.FAILURE:
      return {
        ...state,
        loading: false,
        suggestions: [],
        error: action.payload
      }
    case WordAutocompleteRoutine.SUCCESS:
      return {
        ...state,
        suggestions: action.payload,
        loading: false,
        error: undefined
      }
    default:
      return state
  }
}

export function * requestWordSuggestions (action: { type: string, payload: string }) {
  yield put(WordAutocompleteRoutine.request())
  try {
    const response = yield call(getWordAutocompleteList, action.payload)
    yield put(WordAutocompleteRoutine.success(response))
  } catch (error) {
    yield put(
      WordAutocompleteRoutine.failure(FETCH_WORD_AUTOCOMPLETE_ERROR)
    )
  }
}

export function * watchSaga () {
  yield takeLatest(WordAutocompleteRoutine.TRIGGER, requestWordSuggestions)
}
