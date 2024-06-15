import React from 'react';
import { useState, useEffect } from 'react';
import '../css/Overview.css';
import ImageWithFallback from '../partials/ImageWithFallback';
import Background from '../partials/Background';
import Search from '../partials/Search';

function Overview() {
    const [ games, setGames ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null)
    const [ filter, setFilter ] = useState('');

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

    const handleFilter = (searchValue) => {
        setFilter(searchValue);
    }
    
    const filtered = games ? games.data.appids.filter(x => x.name.toLowerCase().includes(filter.toLowerCase())) : []


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
            <Search onSubmit={handleFilter}></Search>
            <div className='games-wrapper'>
                {filtered.map((app) => (

                    <div key={app.appid} className='card-wrapper'>
                        <p className="card-body">{app.name}</p>
                        <ImageWithFallback src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_600x900_2x.jpg`} fallbackSrc={`/images/no-art.png`} className="hero-capsule" />
                        <div className="card-appid">{app.appid}</div>
                    </div>
                ))}
            </div>
            <Background />
        </>
    )
}

export default Overview;
