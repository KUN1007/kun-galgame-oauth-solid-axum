import { Router, Route } from '@solidjs/router'
import { KunHome } from './pages/Home'
import UiShowcase from './pages/Ui'

export default function Kun() {
  return (
    <Router>
      <Route path="/" component={KunHome} />
      <Route path="/ui" component={UiShowcase} />
    </Router>
  )
}
