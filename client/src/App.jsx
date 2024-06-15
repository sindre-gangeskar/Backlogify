import './css/App.css'
import Overview from './views/Overview'
import Navbar from './partials/Navbar';
import Footer from './partials/Footer';

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Overview />
      <Footer />   
    </>
  )
}

export default App
