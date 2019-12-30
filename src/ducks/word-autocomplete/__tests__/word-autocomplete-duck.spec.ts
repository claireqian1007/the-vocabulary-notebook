import { takeLatest } from 'redux-saga/effects'

import reducer, { WordAutocompleteRoutine, initialState, requestWordSuggestions, isLoading, getError, getSuggestions, watchSaga } from '../'
import recordSaga from '../../../utils/record-saga'
import * as services from '../../../services'
import { FETCH_WORD_AUTOCOMPLETE_ERROR } from '../../../utils/errors'

jest.mock('../../../services', () => ({
  getWordAutocompleteList: jest.fn()
}))

describe('Given the WordAutocomplete Saga', () => {
  const mockedGetWordAutocompleteList = services.getWordAutocompleteList as jest.Mock
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('The Saga', () => {
    it('should dispatch request first', async () => {
      const initialAction = WordAutocompleteRoutine.trigger('lib')
      const dispatched = await recordSaga(
        requestWordSuggestions,
        initialAction,
        initialState
      )
      mockedGetWordAutocompleteList.mockResolvedValueOnce([])
      expect(dispatched[0]).toEqual(WordAutocompleteRoutine.request())
    })

    it('should call service#getWordAutocompleteList once', async () => {
      const initialAction = WordAutocompleteRoutine.trigger('lib')
      await recordSaga(requestWordSuggestions, initialAction, initialState)
      expect(mockedGetWordAutocompleteList).toHaveBeenCalledTimes(1)
      expect(mockedGetWordAutocompleteList).toHaveBeenCalledWith('lib')
    })

    describe('when getWordAutocompleteList rejects with an error', () => {
      it('should dispatch failure', async () => {
        const initialAction = WordAutocompleteRoutine.trigger('lib')
        mockedGetWordAutocompleteList.mockRejectedValueOnce(new Error('Network Error'))
        const dispatched = await recordSaga(
          requestWordSuggestions,
          initialAction,
          initialState
        )
        expect(dispatched).toEqual([
          WordAutocompleteRoutine.request(),
          WordAutocompleteRoutine.failure(FETCH_WORD_AUTOCOMPLETE_ERROR)
        ])
      })
    })

    describe('when getWordAutocompleteList resolves after request', () => {
      it('should dispatch success', async () => {
        const initialAction = WordAutocompleteRoutine.trigger('lib')
        const successRes = ['lib', 'Lib Dem']
        mockedGetWordAutocompleteList.mockResolvedValueOnce(successRes)
        const dispatched = await recordSaga(
          requestWordSuggestions,
          initialAction,
          initialState
        )
        expect(dispatched).toEqual([
          WordAutocompleteRoutine.request(),
          WordAutocompleteRoutine.success(successRes)
        ])
      })
    })
  })

  describe('The reducer function', () => {
    const state = {
      loading: false,
      suggestions: ['lib', 'Lib Dem'],
      error: undefined
    }

    describe('when no known action is passed', () => {
      it('should return the current state', () => {
        expect(reducer(state, { type: 'UNKNOWN' })).toEqual(state)
      })
    })

    describe('when the TRIGGER action is dispatched', () => {
      it('should reset to the initial state', () => {
        const result = reducer(state, WordAutocompleteRoutine.trigger())
        expect(result).toEqual(initialState)
      })
    })

    describe('when the REQUEST action is dispatched', () => {
      it('should set loading to true only', () => {
        const result = reducer(state, WordAutocompleteRoutine.request())
        expect(isLoading(result)).toBe(true)
        expect(result).toStrictEqual({ ...result, loading: true })
      })
    })

    describe('when the FAILURE action is dispatched', () => {
      it('should merge the payload and set loading to false', () => {
        const result = reducer(state, WordAutocompleteRoutine.failure(FETCH_WORD_AUTOCOMPLETE_ERROR))
        expect(isLoading(result)).toBe(false)
        expect(getError(result)).toBe(FETCH_WORD_AUTOCOMPLETE_ERROR)
      })
    })

    describe('when the SUCCESS action is dispatched', () => {
      it('should set the error to null, loading to false, isResetSuccessfully to true', () => {
        const result = reducer(state, WordAutocompleteRoutine.success([
          'lib', 'Lib Dem'
        ]))
        expect(isLoading(result)).toBe(false)
        expect(getSuggestions(result)).toEqual(['lib', 'Lib Dem'])
        expect(getError(result)).toBe(undefined)
      })
    })
  })

  describe('The watch function', () => {
    it('should take latest TRIGGER to `requestWordSuggestions`', () => {
      expect(watchSaga().next().value).toEqual(
        takeLatest(WordAutocompleteRoutine.TRIGGER, requestWordSuggestions)
      )
    })
  })
})
