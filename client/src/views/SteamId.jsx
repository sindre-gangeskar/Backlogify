import React from 'react';
import '../css/SteamId.css';

import { useState, useEffect } from 'react';
function SteamId({ onSubmit }) {
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const steamid = formdata.get('steamid');
        onSubmit(steamid);
    }

    return (
        <>
            <div className="form-wrapper">
            <form action="http://localhost:3000/steamid" method="get" onSubmit={handleFormSubmit} className='steamid'>
                <h1>Enter Steam ID</h1>
                <input type="text" placeholder='SteamID e.g: 76561198014858853' name='steamid' />
            </form>
            </div>
        </>
    )
}

export default SteamId;