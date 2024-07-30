import React, { useState, useEffect, useRef, memo } from 'react';
import { useLocation } from 'react-router-dom';

/* Components */
import ImageWithFallback from '../partials/ImageWithFallback';
import Background from '../partials/Background';
import Search from '../partials/Search';
import Loading from './Loading';
import Modal from '../partials/Modal';
import CardWrapper from '../partials/CardWrapper'

/* Classes */
import Timer from '../js/Timer';
import Utils from '../js/utils';

/* CSS */
import '../css/Overview.css';
import '../css/index.css';

import { RxCross2 } from 'react-icons/rx';

function Backlog() {
    const timer = new Timer();
    const utils = new Utils();
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
    const [ modalButtonText, setModalButtonText ] = useState(null);
    const [ modalCurrentApp, setModalCurrentApp ] = useState(null);
    const [ remove, setRemove ] = useState(false);
    const [ gameCardScale, setGameCardScale ] = useState(parseInt(localStorage.getItem('cardScale') || 1));

    const gamesWrapperRef = useRef(null);
    const modalWrapperRef = useRef(null);
    const gamesFormRef = useRef(null);

    const [ refreshing, setRefreshing ] = useState(false);

    const [ loadingVisible, setLoadingVisible ] = useState(true);

    const filtered = games ? games?.data.appids.filter(x => x.name.toLowerCase().includes(filter.toLowerCase())) : [];

    const removeFromBacklog = async (appid) => {
        setModalVisible(false);
        setRefreshing(true);
        timer.delay(0.1, () => { setModalOpen(false) })

        const response = await fetch(`http://localhost:3000/backlog`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appid: +appid, steamid: steamid })
        })

        /* Refresh Games after deletion */
        if (response.ok) {
            console.log(`Deleted: ${appid} from backlog`)
        }
        else throw new Error('Could not remove from backlog');

        setRefreshing(false);
    }

    useEffect(() => {
        document.title = 'Backlog';
    }, [])

    /* Save card scale value to localStorage on change */
    useEffect(() => {
        localStorage.setItem('cardScale', +gameCardScale);
    }, [ gameCardScale ])

    /* Refresh games after deletion */
    useEffect(() => {
        setLoadingVisible(false);
        const getGames = async () => {
            try {
                const response = await fetch(`http://localhost:3000/backlog/${steamid}`);
                if (response.ok) {
                    const games = await response.json();
                    setRefreshing(false);

                    if (games && games.data.appids) {
                        setGames(games);
                    } else {
                        setGames(null);
                        setError(`No entries found in the backlog`);
                    }
                }
            } catch (error) {
                setError(`No entries found in the backlog`);
            }
        };

        getGames();
    }, [ refreshing ]);

    /* Modal */
    useEffect(() => {

        if (modalOpen && modalCurrentApp) {
            let buttonText = `Remove ${modalCurrentApp.name} from the backlog`;
            setModalButtonText(buttonText);
            if (remove) {
                buttonText = `Removing ${modalCurrentApp.name} from the backlog`
                setModalButtonText(buttonText);
            }

            setModalFooter(
                <>
                    <span className='modal-footer'>
                        <form id='app-form' ref={gamesFormRef}>
                            <input type="hidden" name='appid' value={modalCurrentApp.appid} />
                            <input type="hidden" name='name' value={modalCurrentApp.name} />
                            <input type="hidden" name='playtime_forever' value={modalCurrentApp.playtime_forever} />
                            <input type="hidden" name='steamid' value={localStorage.getItem('steamid')} />
                            <button type='button' className={`modal-footer-btn ${remove === true ? 'removed' : 'remove'}`} onClick={(() => {
                                if (confirm(`Are you sure you want to remove ${modalCurrentApp.name} from the backlog?`)) {
                                    setRemove(true);
                                    timer.delay(1, (() => { removeFromBacklog(modalCurrentApp.appid).then(() => { setRemove(false) }) }))
                                }
                            })}>{modalButtonText}</button>
                        </form>
                    </span>
                </>)
        }
    }, [ modalOpen, modalCurrentApp, modalButtonText, remove ])

    /* Games */
    useEffect(() => {
        let finished = false;
        const getGames = async () => {
            setLoadingVisible(true);
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/backlog/${steamid}`);
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
        return (() => { finished = true })
    }, [ steamid ]);


    function handleFilter(searchValue) {
        setFilter(searchValue);
    }
    function setModal(app) {
        setModalCurrentApp(app);
        setModalTitle(
            <span className="modal-top">
                <pre className="modal-appid">AppID: {app.appid}</pre>
                <div className="modal-title">{app.name}</div>
                <button onClick={closeModal} className='modal-close-btn'><RxCross2></RxCross2></button>
            </span>)
        setModalBody(<>
            <div className="modal-body">
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
                    <HeroPoster app={app} key={app.appid} className="hero-poster-img" />
                </div>
                <div className="library-hero-wrapper" >
                    <ImageWithFallback root={modalWrapperRef.current} key={app.appid}
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_hero.jpg`}
                        fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                        className='library-hero'
                        alt="library_hero.jpg"
                    />
                </div>
            </div>
        </>)

        setModalOpen(true);
        timer.delay(0.1, () => { setModalVisible(true) })
    }
    function closeModal() {
        setModalVisible(false);
        timer.delay(0.2, () => { setModalOpen(false) })
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
            <Loading key={loading} className={`${loadingVisible ? 'visible' : ''}`} />
            <Search onSubmit={handleFilter} setAppIDVisibility={setAppIDVisibility} setGameTitleVisibility={setGameTitleVisibility} increaseScale={() => { utils.increaseScale(setGameCardScale, gameCardScale) }} decreaseScale={() => { utils.decreaseScale(setGameCardScale, gameCardScale) }} scaleValue={gameCardScale} />
            <div className='games-wrapper' ref={gamesWrapperRef}>
                {filtered.length > 0 ? (
                    filtered.map((app) => (
                        <CardWrapper key={app.appid} app={app} showAppID={appIdVisibility} showGameTitle={gameTitleVisibility} scale={gameCardScale} onClick={(() => { setModal(app); })} />
                    ))
                ) : (<h1>No games in the backlog</h1>)}
            </div>
            <div className="panel"></div>
            <Background />
            <Modal
                className={`modal-wrapper ${modalVisible ? 'open' : 'close'}`}
                isOpen={modalOpen}
                title={modalTitle}
                body={modalBody}
                footer={modalFooter}
                onClose={(() => { closeModal() })}
                backdrop="true"
            />
        </>
    );
}

export default Backlog;
