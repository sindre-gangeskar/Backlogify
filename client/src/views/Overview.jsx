import React, { useState, useEffect, useRef, memo } from 'react';
import { useLocation } from 'react-router-dom';
import ImageWithFallback from '../partials/ImageWithFallback';
import Background from '../partials/Background';
import Search from '../partials/Search';
import Loading from './Loading';
import Modal from '../partials/Modal';
import CardWrapper from '../partials/CardWrapper'

import '../css/Overview.css';

function Overview() {
    const location = useLocation();
    const steamid = location.state?.steamid || localStorage.getItem('steamid');

    const [ games, setGames ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ filter, setFilter ] = useState('');
    const [ visible, setVisible ] = useState(false);

    const [ modalOpen, setModalOpen ] = useState(false);
    const [ modalTitle, setModalTitle ] = useState(null);
    const [ modalBody, setModalBody ] = useState(null);
    const [ modalFooter, setModalFooter ] = useState(null);
    const [ modalVisible, setModalVisible ] = useState(false);
    const gamesWrapperRef = useRef(null);
    const modalWrapperRef = useRef(null);

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
    function setModal(app) {
        setModalTitle(<div className='title'>{app.name}</div>
        );
        setModalBody(
            <>
                <table className='gd-table-wrapper'>
                    <thead>
                        <tr>
                            <td>App ID</td>
                            <td>Title</td>
                            <td>Total Playtime in hours</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{app.appid}</td>
                            <td>{app.name}</td>
                            <td>{Math.round(app.playtime_forever / 60)}</td>
                        </tr>
                    </tbody>
                </table>
                <HeroPoster app={app} key={app.appid} />
                <div className="library-hero-wrapper" >
                    <ImageWithFallback root={modalWrapperRef.current} key={app.appid}
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_hero.jpg`}
                        fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                        className='library-hero'
                        alt="library_hero.jpg"
                    />
                </div>
            </>
        )
        setModalFooter(
            <>
                <span>
                    <button>Add to Backlog</button>
                </span>
            </>)

        setModalOpen(true);
        setTimeout(() => {
            setModalVisible(true);
        }, 100)

    }

    function closeModal() {
        setModalVisible(false);
        setTimeout(() => {
            setModalOpen(false);
        }, 100)
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

    const HeroPoster = memo(({ app }) => {
        return (
            <ImageWithFallback root={modalWrapperRef.current}
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_600x900.jpg`}
                fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                className="hero-poster"
            />
        )
    })

    return (
        <>
            <Search onSubmit={handleFilter} setVisible={setVisible} />
            <div className='games-wrapper' ref={gamesWrapperRef}>
                {filtered.map((app) => (
                    <CardWrapper key={app.appid} app={app} showAppID={visible} onClick={(() => { setModal(app) })} />
                ))}
            </div>
            <Background />
            <Modal
                className={`modal-wrapper ${modalVisible ? 'open' : 'close'}`}
                isOpen={modalOpen}
                title={modalTitle}
                body={modalBody}
                footer={modalFooter}
                onClose={(() => { closeModal() })}
            />
        </>
    );
}

export default Overview;
