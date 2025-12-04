import './App.css'

import Navbar from './components/Navbar.jsx'

import { Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import GamerPage from './pages/GamerPage.jsx';
import DeveloperPage from './pages/DeveloperPage.jsx'
import PlatformPage from './pages/PlatformPage.jsx';
import GenrePage from './pages/GenrePage.jsx';


function App() {
  return (
    <div>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reviews" element={<ReviewPage />}/>
          <Route path="/gamers" element={<GamerPage />}/>
          <Route path="/developers" element={<DeveloperPage />}/>
          <Route path="/platforms" element={<PlatformPage />}/>
          <Route path="/genres" element={<GenrePage />}/>
        </Routes>
      </div>
  )
}

export default App
