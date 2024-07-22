import './css/App.css'
import './css/index.css';
import Overview from './views/Overview'
import Backlog from './views/Backlog'
import Navbar from './partials/Navbar';
import Footer from './partials/Footer';
import Home from './views/Home';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useGlobalState from './js/globalStateStore';
import Utils from './js/utils';

function App() {
  const [ setAuthenticated ] = useGlobalState(state => [ state.setAuthenticated ]);
  const [ visible, setVisible ] = useState(false);
  const utils = new Utils();
  const navigate = useNavigate();

  useEffect(() => {
    utils.checkSession(navigate, setAuthenticated);
  }, [])


  return (
    <>
      <Navbar />
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
            <Home key={'home'} />
            <Footer key={'footer'} />
          </>
        }>
        </Route>

      </Routes>
    </>
  )
}

export default App
