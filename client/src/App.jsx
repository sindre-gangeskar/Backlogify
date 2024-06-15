import { useState } from 'react'
import './css/App.css'
import Overview from './views/Overview'
import Navbar from './partials/Navbar';
import Search from './partials/Search';
import Footer from './partials/Footer';

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Search></Search>
      <Overview />
      <Footer />
      
    </>
  )
}

export default App
