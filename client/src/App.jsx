import './css/App.css'
import Overview from './views/Overview'
import Navbar from './partials/Navbar';
import Footer from './partials/Footer';
import SteamId from './views/SteamId';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [ visible, setVisible ] = useState(false);

  return (
    <>
      <Routes>
        <Route path='/overview' key={'/overview'} element={
          <>
            <Navbar key={'navbar'} />
            <Overview key={'overview'} setVisible={setVisible} />
            <Footer key={'footer'} />
          </>
        }></Route>

        <Route path='/' element={
          <>
            <Navbar key={'navbar'} />
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
