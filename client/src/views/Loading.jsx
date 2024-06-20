import React from 'react';
import '../css/Loading.css';
import Navbar from '../partials/Navbar';
function Loading() {
    return (
        <>
            <Navbar/>
            <div className="loading-wrapper">
                <div className="inner"></div>
                <div className="outer"></div>
                <h4 className='text'>Loading...</h4>
            </div>
        </>
    )
}

export default Loading;