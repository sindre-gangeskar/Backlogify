import React from 'react';
import '../css/Loading.css';
import Footer from '../partials/Footer';
import { FaSteam } from "react-icons/fa";
import SteamBacklogifyIcon from '../partials/SteamBacklogifyIcon';

function Loading({className}) {
    return (
        <>
            <div className={`loading-wrapper ${className}`}>
                <div className="inner"></div>
                <div className="outer"></div>
                <div className="loader"><SteamBacklogifyIcon width={300} height={300} /></div>
            </div>
            <Footer></Footer>
        </>
    )
}

export default Loading;