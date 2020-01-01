import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import QuickAddPage from './pages/quick-add'

export default function NoteBookApplication () {
  return <Router>
    <Switch>
      <Route path="/quick-add">
        <QuickAddPage />
      </Route>
    </Switch>
  </Router>
}
