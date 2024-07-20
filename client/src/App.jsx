import './css/App.css'
import './css/index.css';
import Overview from './views/Overview'
import Backlog from './views/Backlog'
import Navbar from './partials/Navbar';
import Footer from './partials/Footer';
import SteamId from './views/SteamId';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
function App() {
  const [ visible, setVisible ] = useState(false);

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/overview' key={'/overview'} element={
          <>
            <Overview key={'overview'} setVisible={setVisible} />
            <Footer key={'footer'} />
          </>
        }></Route>
        <Route path='/backlog' key={'/backlog'} element={
          <>
            <Backlog key={'backlog'} setVisible={setVisible} />
            <Footer key={'footer'} />
          </>
        }></Route>

        <Route path='/' element={
          <>
            <SteamId key={'steamid'} />
            <Footer key={'footer'} />
          </>
        }>
        </Route>

      </Routes>
    </>
  )
}

export default App
