import React from 'react'
import Navbar from './components/ui/Navbar'
import { Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CodeReviewPage from './pages/CodeReviewPage'
import ErrorPage from './pages/ErrorPage'


const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path='/code-review' element={<CodeReviewPage />}/>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>
    </>
  )
}

export default App