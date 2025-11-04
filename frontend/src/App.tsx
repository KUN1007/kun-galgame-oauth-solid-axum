import { Router, Route } from '@solidjs/router'
import { KunHome } from './pages/Home'
import { UiShowcase } from './pages/Ui'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'
import { ProfilePage } from './pages/Profile'
import { ClientNewPage } from './pages/ClientNew'
import { ClientDetailPage } from './pages/ClientDetail'
import { ClientsListPage } from './pages/Clients'
import { ConsentPage } from './pages/Consent'
import { Layout } from './components/app/Layout'

const Kun = () => {
  return (
    <Router>
      <Route path="/" component={Layout}>
        <Route path="/" component={KunHome} />
        <Route path="/ui" component={UiShowcase} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/user/:id" component={ProfilePage} />
        <Route path="/clients/new" component={ClientNewPage} />
        <Route path="/clients" component={ClientsListPage} />
        <Route path="/clients/:id" component={ClientDetailPage} />
        <Route path="/consent" component={ConsentPage} />
      </Route>
    </Router>
  )
}

export default Kun
