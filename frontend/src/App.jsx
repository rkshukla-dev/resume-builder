import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import UserProvider from './context/userContext'

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </UserProvider>
  )
}

export default App