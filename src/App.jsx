import React from 'react'
import Navbar from './components/ui/Navbar'
import { Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CodeReviewPage from './pages/CodeReviewPage'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path='/code-review' element={<CodeReviewPage />}/>
      </Routes>
    </>
  )
}

export default App