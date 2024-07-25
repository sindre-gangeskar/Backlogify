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
import { useIdleTimer } from 'react-idle-timer';
function App() {
  const [ authenticated, setAuthenticated ] = useGlobalState(state => [ state.authenticated, state.setAuthenticated ]);
  const [ visible, setVisible ] = useState(false);
  const utils = new Utils();
  const navigate = useNavigate();

  useIdleTimer({
    disabled: !authenticated,
    timeout: 1000 * 60 * 1,
    onIdle: (() => {
      alert("You've been logged out due to inactivity");
      utils.inactiveLogout(setAuthenticated, navigate);
    }),
    /* promptBeforeIdle: 1000 * 60 * 0.5, */
    /* onPrompt: (() => {
      if (!confirm('Do you want to stay logged in?')) {
        utils.inactiveLogout(setAuthenticated, navigate);
      }
    }) */
  })

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
