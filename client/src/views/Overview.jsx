import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ImageWithFallback from '../partials/ImageWithFallback';
import Background from '../partials/Background';
import Search from '../partials/Search';
import Loading from '../views/Loading';

import '../css/Overview.css';


function Overview() {
    const location = useLocation();
    const steamid = location.state?.steamid || localStorage.getItem('steamid');

    const [ games, setGames ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null)
    const [ filter, setFilter ] = useState('');


    useEffect(() => {
        const getGames = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/${steamid}`);
                if (response.ok) {
                    const games = await response.json();
                    if (games && games.data.appids) {
                        setGames(games);
                    }
                    else {
                        setGames(null);
                        setError(`Could not retrieve games from Steam ID: ${steamid}`)
                    }
                }
            } catch (error) {
                setError(`Could not retrieve games from Steam ID: ${steamid}`);
            }
            finally {
                setLoading(false);
            }
        }
        getGames();
    }, [ steamid ]);


    const handleFilter = (searchValue) => {
        setFilter(searchValue);
    }

    const filtered = games ? games?.data.appids.filter(x => x.name.toLowerCase().includes(filter.toLowerCase())) : []
    if (loading) {
        return (
            <Loading key={loading} />
        )
    }

    if (error) {
        return (
            <>
                <div className="games-wrapper">
                    <h3>{error}</h3>
                </div>
                <Background />
            </>
        )
    }

    else return (
        <>
            <Search onSubmit={handleFilter}></Search>
            <div className='games-wrapper'>
                {filtered.map((app) => (
                        <div key={app.appid} className='card-wrapper'>
                            <div className="card-appid">{app.appid}</div>
                            <div className="card-title">{app.name}</div>
                            <ImageWithFallback src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_600x900.jpg`} fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`} className="hero-capsule" />
                        </div>
                ))}
            </div>
            <Background />
        </>
    )
}

export default Overview;
