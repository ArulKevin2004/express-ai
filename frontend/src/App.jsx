import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ROUTER_ENDPOINTS } from './constants/RouterEndpoints'

function App() {

  return (
    <Router>
      <Routes>
        <Route path={ROUTER_ENDPOINTS.LANDING} element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
