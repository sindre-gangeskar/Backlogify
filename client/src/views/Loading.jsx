import React from 'react';
import '../css/Loading.css';
import Navbar from '../partials/Navbar';
import Footer from '../partials/Footer';
import { FaSteam } from "react-icons/fa";

function Loading({className}) {
    return (
        <>
            <Navbar />
            <div className={`loading-wrapper ${className}`}>
                <div className="inner"></div>
                <div className="outer"></div>
                <div className="loader"><FaSteam/></div>
            </div>
            <Footer></Footer>
        </>
    )
}

export default Loading;