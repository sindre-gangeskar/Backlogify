import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
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
    const [ error, setError ] = useState(null);
    const [ filter, setFilter ] = useState('');
    const [ visible, setVisible ] = useState(false);

    const filtered = games ? games?.data.appids.filter(x => x.name.toLowerCase().includes(filter.toLowerCase())) : [];

    useEffect(() => {
        const getGames = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/${steamid}`);
                if (response.ok) {
                    const games = await response.json();
                    if (games && games.data.appids) {
                        setGames(games);
                    } else {
                        setGames(null);
                        setError(`Could not retrieve games from Steam ID: ${steamid}`);
                    }
                }
            } catch (error) {
                setError(`Could not retrieve games from Steam ID: ${steamid}`);
            } finally {
                setLoading(false);
            }
        };
        getGames();
    }, [ steamid ]);

    function handleFilter(searchValue) {
        setFilter(searchValue);
    }

    if (loading) {
        return <Loading key={loading} />;
    }

    if (error) {
        return (
            <>
                <div className="games-wrapper">
                    <h3>{error}</h3>
                </div>
                <Background />
            </>
        );
    }

    /* Create the function component, and pass it in as a CardWrapper tag in the games-wrapper element*/
    const CardWrapper = ({ app }) => {
        const { ref, inView } = useInView({
            threshold: 0.15,
            root: document.querySelector('.games-wrapper'),
            triggerOnce: false
        })
        return (
            <div ref={ref} className={`card-wrapper ${inView ? 'visible' : ''}`} key={app.appid}>
                <div className={`card-appid ${visible ? 'visible' : ''}`}>{app.appid}</div>
                <div className="card-title">{app.name}</div>
                <ImageWithFallback
                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_600x900.jpg`}
                    fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                    className="hero-capsule"
                />
            </div>
        );
    }

    return (
        <>
            <Search onSubmit={handleFilter} setVisible={setVisible} />
            <div className='games-wrapper'>
                {filtered.map((app) => (
                    <CardWrapper key={app.appid} app={app} />
                ))}
            </div>
            <Background />
        </>
    );
}

export default Overview;
