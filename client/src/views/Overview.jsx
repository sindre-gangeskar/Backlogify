import React from 'react';
import { useState, useEffect } from 'react';
import '../css/Overview.css';
import ImageWithFallback from '../partials/ImageWithFallback';
import Background from '../partials/Background';

function Overview() {
    const [ games, setGames ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null)

    useEffect(() => {
        const getGames = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/');
                if (response.ok) {
                    const games = await response.json();
                    setGames(games);
                }
                else setError(response);
            } catch (error) {
                setError('Could not retrieve games');
            }
            finally {
                setLoading(false);
            }
        }
        getGames();
    }, []);

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    if (error) {
        return (
            <div className="error">{error}</div>
        )
    }

    else return (
        <>
            <div className='games-wrapper'>
                {games && games.data.appids.map((app, index) => (
                    <div key={index} className='card-wrapper'>
                        <div className="card-body">{app.name}</div>
                        <ImageWithFallback src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_600x900_2x.jpg`} fallbackSrc={`https://via.placeholder.com/600x900?text=${app.name}`} className="hero-capsule"/>
                        <div className="card-appid">{app.appid}</div>
                    </div>
                ))}
            </div>
            <Background/>
        </>
    )
}

export default Overview;
