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
import Auth from './js/auth';
import Timer from './js/Timer';
import { useIdleTimer } from 'react-idle-timer';
import Modal from './partials/Modal';

function App() {
  const [ authenticated, setAuthenticated ] = useGlobalState(state => [ state.authenticated, state.setAuthenticated ]);
  const [ visible, setVisible ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ modalOpen, setModalOpen ] = useState(false);

  const auth = new Auth();
  const timer = new Timer();
  const navigate = useNavigate();

  useIdleTimer({
    disabled: !authenticated,
    timeout: 1000 * 60 * 5,
    onIdle: (() => {
      setModalOpen(true);
      timer.delay(0.1, () => {
        setModalVisible(true);
      })
      auth.inactiveLogout(setAuthenticated, navigate);
    }),
  })

  useEffect(() => {
    auth.checkSession(navigate, setAuthenticated);
  }, [])


  const modal = ({
    title:
      <p>Idle Timeout</p>,
    body: <p>Logged out due to inactivity</p>,
    footer: <button className="modal-footer-btn add confirm" onClick={closeModal}>OK</button>
  })

  function closeModal() {
    setModalVisible(false);
    timer.delay(0.1, () => {
      setModalOpen(false);
    })
  }

  return (
    <>
      <Modal className={`modal-wrapper ${modalVisible ? 'open' : 'close'}`} title={modal.title} isOpen={modalOpen} body={modal.body} onClose={closeModal} footer={modal.footer} backdrop="false" ></Modal>
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
