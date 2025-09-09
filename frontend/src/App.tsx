import { Router, Route } from '@solidjs/router'
import { onMount } from 'solid-js'
import { KunHome } from './pages/Home'

export default function Kun() {
  return (
    <Router>
      <Route path="/" component={KunHome} />
    </Router>
  )
}
