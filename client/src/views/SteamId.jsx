import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SteamId.css';

function SteamId() {
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const steamid = formdata.get('steamid');

        try {
            const response = await fetch(`http://localhost:3000/${steamid}`)
            if (response.ok) {
                navigate('/overview', { state: { steamid } });
                localStorage.setItem('steamid', steamid);
            }
            else {
                navigate('/', { state: { error: 'Please enter a valid Steam ID' } });
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="form-wrapper">
                <form className='steamid' onSubmit={handleFormSubmit}>
                    <h1>Enter Steam ID</h1>
                    <input
                        type="text"
                        placeholder='SteamID e.g: 76561198014858853'
                        name='steamid'
                        required
                        autoComplete='steamid'
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}

export default SteamId;
