import axios from 'axios'

import getWordAutocompleteList from '../'
import { OXFORD_AUTOCOMPLETE_URL } from '../../../configuration/constraints'

jest.mock('axios', () => ({ get: jest.fn() }))
describe('Given the getWordAutocompleteList function', () => {
  const mockedAxiosGet = axios.get as jest.Mock
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should return empty error when response with error', async () => {
    mockedAxiosGet.mockRejectedValueOnce(new Error('Network Error'))
    const result = await getWordAutocompleteList('lib')
    expect(result).toEqual([])
    expect(mockedAxiosGet).toHaveBeenCalledWith(OXFORD_AUTOCOMPLETE_URL, { params: { q: 'lib' } })
  })

  it('should return the searchtext field', async () => {
    mockedAxiosGet.mockResolvedValueOnce({
      data: {
        results: [{ searchtext: 'lib' }, { searchtext: 'Lib Dem' }]
      }
    })
    const result = await getWordAutocompleteList('lib')
    expect(result).toEqual(['lib', 'Lib Dem'])
  })
})
