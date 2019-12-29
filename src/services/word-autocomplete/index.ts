import axios from 'axios'
import { map } from 'lodash'

import { OXFORD_AUTOCOMPLETE_URL } from '../../configuration/constraints'

export default async function getWordAutocompleteList (word: string): Promise< string[]> {
  try {
    const { data: { results } } = await axios.get(OXFORD_AUTOCOMPLETE_URL, {
      params: { q: word }
    })
    return map(results, 'searchtext')
  } catch (e) {
    return []
  }
}
