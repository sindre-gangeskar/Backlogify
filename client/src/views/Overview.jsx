import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/* Components */
import ImageWithFallback from '../partials/ImageWithFallback';
import Background from '../partials/Background';
import Search from '../partials/Search';
import Loading from './Loading';
import CardWrapper from '../partials/CardWrapper';
import HeroPoster from '../partials/HeroPoster';
import Modal from '../partials/Modal';

/* Classes */
import Timer from '../classes/Timer';

/* CSS */
import '../css/Overview.css';

function Overview() {
    const timer = new Timer();
    const location = useLocation();
    const steamid = location.state?.steamid || localStorage.getItem('steamid');

    const [ games, setGames ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ filter, setFilter ] = useState('');
    const [ appIdVisibility, setAppIDVisibility ] = useState(false);
    const [ gameTitleVisibility, setGameTitleVisibility ] = useState(false);

    const [ modalOpen, setModalOpen ] = useState(false);
    const [ modalTitle, setModalTitle ] = useState(null);
    const [ modalBody, setModalBody ] = useState(null);
    const [ modalFooter, setModalFooter ] = useState(null);
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ modalCurrentApp, setModalCurrentApp ] = useState(null);

    const [ loadingVisible, setLoadingVisible ] = useState(true);


    const gamesWrapperRef = useRef(null);
    const modalWrapperRef = useRef(null);
    const gamesFormRef = useRef(null);
    const filtered = games ? games?.data.appids.filter(x => x.name.toLowerCase().includes(filter.toLowerCase())) : [];

    /* Games */
    useEffect(() => {
        let finished = false;

        const getGames = async () => {
            setLoadingVisible(true);
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/${steamid}`);
                if (response.ok && !finished) {
                    const games = await response.json();
                    if (games && games.data.appids) {
                        setGames(games);
                    } else {
                        setGames(null);
                        setError(`No entries found in the backlog`);
                    }
                }
            } catch (error) {
                setError(`No entries found in the backlog`);
            } finally {
                timer.delay(0.5, (() => { setLoadingVisible(false) }));
                setLoading(false);
            }
        };

        getGames();
        return (() => finished = true)
    }, [ steamid ]);

    /* Modal */
    useEffect(() => {
        if (modalOpen && modalCurrentApp) {
            let buttonText = `Add ${modalCurrentApp.name} to the backlog`;

            if (modalCurrentApp.backlogged)
                buttonText = `${modalCurrentApp.name} is added to the backlog`

            setModalFooter(
                <>
                    <span>
                        <form id='app-form' ref={gamesFormRef} onSubmit={handleSubmit}>
                            <input type="hidden" name='appid' value={modalCurrentApp.appid} />
                            <input type="hidden" name='name' value={modalCurrentApp.name} />
                            <input type="hidden" name='playtime_forever' value={modalCurrentApp.playtime_forever} />
                            <input type="hidden" name='steamid' value={localStorage.getItem('steamid')} />
                            <button type='submit' className={`modal-submit-btn ${modalCurrentApp.backlogged ? 'backlogged' : ''}`}>{buttonText}</button>
                        </form>
                    </span>
                </>
            );
        }
    }, [ modalCurrentApp ]);

    async function handleSubmit(event) {
        event.preventDefault();
        const form = new FormData(gamesFormRef.current);
        const name = form.get('name');
        const appid = form.get('appid');
        const playtime_forever = form.get('playtime_forever');
        const steamid = form.get('steamid');

        try {
            const response = await fetch('http://localhost:3000/backlog', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ appid, name, playtime_forever, steamid, backlogged: true })
            });

            if (response.ok) {
                setModalCurrentApp({ ...modalCurrentApp, backlogged: true });
                modalCurrentApp.backlogged = true;
            }

        } catch (error) {
            console.error(error);
        }
    }
    function handleFilter(searchValue) {
        setFilter(searchValue);
    }
    function setModal(app) {
        setModalCurrentApp(app);
        setModalTitle(<div className='title'>{app.name}</div>);
        setModalBody(<>
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
            <div className="hero-poster-wrapper">
                <HeroPoster app={app} key={app.appid} className="hero-poster" />
            </div>
            <div className="library-hero-wrapper" >
                <ImageWithFallback root={modalWrapperRef.current} key={app.appid}
                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_hero.jpg`}
                    fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                    className='library-hero'
                    alt="library_hero.jpg"
                />
            </div>
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
    return (
        <>
            <Loading key={loading} className={`${loadingVisible ? 'visible' : ''}`} />;
            <Search onSubmit={handleFilter} setAppIDVisibility={setAppIDVisibility} setGameTitleVisibility={setGameTitleVisibility} />
            <div className='games-wrapper' ref={gamesWrapperRef}>
                {filtered.map((app) => (
                    <CardWrapper key={app.appid} app={app} showAppID={appIdVisibility} showGameTitle={gameTitleVisibility} onClick={(() => { setModal(app); })} />
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
