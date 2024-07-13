import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BiCheckCircle } from "react-icons/bi";
import { FaCircleArrowRight, FaCircleArrowLeft } from "react-icons/fa6";
/* Components */
import ImageWithFallback from '../partials/ImageWithFallback';
import Background from '../partials/Background';
import Search from '../partials/Search';
import Loading from './Loading';
import CardWrapper from '../partials/CardWrapper';
import HeroPoster from '../partials/HeroPoster';
import Modal from '../partials/Modal';
import AchievementsProgress from '../partials/AchievementsProgress';

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
    const [ gameCardScale, setGameCardScale ] = useState(parseInt(localStorage.getItem('cardScale') || 1));

    const [ page, setPage ] = useState(1);
    const [ gamesPerPage, setGamesPerPage ] = useState(100);

    const [ achievements, setAchievements ] = useState([]);
    const [ achieved, setAchieved ] = useState([]);
    const [ achievementProgress, setAchievementProgress ] = useState(0);
    const [ achievementsVisible, setAchievementsVisible ] = useState(false);
    const [ achievementTransition, setAchievementTransition ] = useState(false);

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
    const progressBarRef = useRef(null);

    const filtered = games ? games?.data.appids.filter(x => x.name.toLowerCase().includes(filter.toLowerCase())) : [];
    const totalPages = Math.ceil(filtered.length / gamesPerPage);

    /* Games */
    useEffect(() => {
        let finished = false;

        const getGames = async () => {
            setLoading(true);

            try {
                const response = await fetch(`http://localhost:3000/${steamid}`);

                if (response.ok && !finished) {
                    const data = await response.json();

                    if (data && data.data.appids.length > 0) {
                        setGames(data);
                    }

                    else {
                        console.log(data);
                        setError(data.data.message);
                    }
                }
            } catch (error) {
                setError(error.message);
            } finally {
                timer.delay(1.5, (() => { setLoadingVisible(false) }))
            }
        };

        getGames();
        return (() => { finished = true; setLoading(false) });
    }, [ steamid ]);

    /* Modal submission */
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
                            <button type='submit' className={`modal-footer-btn  ${modalCurrentApp.backlogged ? 'backlogged' : 'add'}`}>{buttonText}{modalCurrentApp.backlogged ? <BiCheckCircle className='checked' /> : ''}</button>
                        </form>
                    </span>
                </>
            );
        }

    }, [ modalCurrentApp ])

    /* Set achievements in the modal for actively selected game  */
    useEffect(() => {
        const fetchAchievements = async () => {
            if (modalCurrentApp) {
                try {
                    const response = await fetch(`http://localhost:3000/achievements/${steamid}/${modalCurrentApp.appid}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.data.achievements && data.data.achieved) {
                            setAchievements(data.data.achievements);
                            setAchieved(data.data.achieved);
                        }
                        else {
                            setAchievements([]);
                            setAchieved([]);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchAchievements();
    }, [ modalCurrentApp ])

    /* Set achievement progress on achievements change */
    useEffect(() => {
        if (modalCurrentApp && achievements.length > 0) {
            const progress = Math.round((achieved.length / achievements.length) * 100);
            setAchievementProgress(progress);
        }
    }, [ achievements, modalOpen ])

    /* Initiate modal with data */
    useEffect(() => {
        const initiateModal = async () => {
            if (modalCurrentApp) {
                setModalTitle(<div className='title'>{modalCurrentApp.name}</div>);
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
                                <td>{modalCurrentApp.appid}</td>
                                <td>{modalCurrentApp.name}</td>
                                <td>{Math.round(modalCurrentApp.playtime_forever / 60)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <AchievementsProgress progress={achievementProgress} achievements={achievements} achieved={achieved} visible={achievementsVisible} key={modalCurrentApp} ref={progressBarRef} play={achievementTransition} />
                    <div className="hero-poster-wrapper">
                        <HeroPoster app={modalCurrentApp} key={modalCurrentApp.appid} className="hero-poster" />
                    </div>

                    <div className="library-hero-wrapper" >
                        <ImageWithFallback root={modalWrapperRef.current} key={modalCurrentApp.appid}
                            src={`https://steamcdn-a.akamaihd.net/steam/apps/${modalCurrentApp.appid}/library_hero.jpg`}
                            fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${modalCurrentApp.appid}/header.jpg`}
                            className='library-hero'
                            alt="library_hero.jpg"
                        />
                    </div>
                </>)
            }
        }

        initiateModal(modalCurrentApp);
    }, [ modalCurrentApp, achievementProgress, achievements, achieved, achievementTransition ])

    /* Save card scale value to localStorage on change */
    useEffect(() => {
        localStorage.setItem('cardScale', +gameCardScale);
    }, [ gameCardScale ])

    /* Set progress bar visibility */
    useEffect(() => {
        if (modalCurrentApp && modalOpen) {
            timer.delay(0.1, () => { setAchievementsVisible(true); console.log('Set to visible!'); })
        }
        if (!modalOpen) {
            timer.delay(0.1, () => { setAchievementsVisible(false); console.log('Set to hidden!'); });
        }

    }, [ modalOpen ])

    /* Initialize the achievement bar transition  */
    useEffect(() => {
        if (achievementsVisible) {
            timer.delay(1.0, () => {
                setAchievementTransition(true);
            })
        }
        else {
            setAchievementTransition(false);
        }

    }, [ achievementsVisible ])
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
        setPage(1);
    }
    function initializeModal(app) {
        setModalCurrentApp(app);
        setModalOpen(true);
        timer.delay(0.1, (() => { setModalVisible(true) }));
    }
    function closeModal() {
        setModalVisible(false);
        timer.delay(0.1, () => {
            setModalOpen(false);
        });
    }
    function increaseScale() {
        if (gameCardScale >= 3) return;
        setGameCardScale(gameCardScale + 1);
    }
    function decreaseScale() {
        if (gameCardScale <= 0) return;
        setGameCardScale(gameCardScale - 1);
    }
    function paginate(itemsPerPage, currentPage, array) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = currentPage * itemsPerPage;
        const paginatedItems = array.slice(startIndex, endIndex);


        return paginatedItems.map(app => (
            <CardWrapper key={app.appid} app={app} backlogged={app.backlogged ? true : false} showAppID={appIdVisibility} showGameTitle={gameTitleVisibility} scale={gameCardScale} onClick={(() => { initializeModal(app); })} />
        ))
    }
    function nextPage() {
        if (page >= totalPages) return;
        setPage(page + 1);
        scrollToTop();
    }
    function previousPage() {
        if (page <= 1) return;
        setPage(page - 1);
        scrollToTop();

    }
    function goToLastPage() {
        setPage(totalPages);
        scrollToTop();

    }
    function goToFirstPage() {
        setPage(1);
        scrollToTop();

    }
    function set25PerPage() {
        setGamesPerPage(25);
        scrollToTop();

    }
    function set50PerPage() {
        setGamesPerPage(50);
        scrollToTop();

    }
    function set100PerPage() {
        setGamesPerPage(100);
        scrollToTop();

    }
    function setAllInOnePage() {
        setPage(1);
        setGamesPerPage(filtered.length);
        scrollToTop();

    }
    function scrollToTop() {
        if (gamesWrapperRef.current) {
            gamesWrapperRef.current.scrollTo('', 0);
        } else return;

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
            <Loading key={loading} className={`${loadingVisible ? 'visible' : ''}`} />
            <Search onSubmit={handleFilter} setAppIDVisibility={setAppIDVisibility} setGameTitleVisibility={setGameTitleVisibility} increaseScale={increaseScale} decreaseScale={decreaseScale} scaleValue={gameCardScale} set25PerPage={set25PerPage} set50PerPage={set50PerPage} set100PerPage={set100PerPage} seeAllGames={setAllInOnePage} />
            <div className='games-wrapper' ref={gamesWrapperRef}>
                {paginate(gamesPerPage, page, filtered)}
            </div>
            <div className="panel">
                {page !== 1 ?
                    <button className='pagination-first-button' onClick={goToFirstPage}>1</button>
                    : null}

                <span className="pagination-controls">
                    {page !== 1 ?
                        <button className='pagination-button' onClick={previousPage}><FaCircleArrowLeft /></button>
                        : <button className='pagination-button disabled hidden'><FaCircleArrowLeft /></button>}
                    <p>{page}</p>
                    {page !== totalPages ?
                        <button className='pagination-button' onClick={nextPage}><FaCircleArrowRight /></button>
                        : <button className='pagination-button disabled hidden'><FaCircleArrowRight /></button>}
                </span>

                {page !== totalPages ?
                    <button className='pagination-last-button' onClick={goToLastPage}>{totalPages}</button>
                    : null}
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
