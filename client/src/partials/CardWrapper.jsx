import React, { useState, useEffect, forwardRef, useRef } from "react";
import ImageWithFallback from "./ImageWithFallback";
import { BiCheckCircle } from "react-icons/bi";
import '../css/CardWrapper.css';
import Timer from '../js/Timer';
const timer = new Timer();

const CardWrapper = React.memo(forwardRef(({ app, onClick, showAppID, showGameTitle, scale, backlogged }, ref) => {

    // State to store the app details
    const [ appDetails, setAppDetails ] = useState(null);
    const [ currentAppDetails, setCurrentAppDetails ] = useState(null);
    const [ isHovering, setIsHovering ] = useState(false);
    const [ hasFetched, setHasFetched ] = useState(false);
    const server = import.meta.env.VITE_SERVER_BASEURL;
    const videoRef = useRef(null);


    useEffect(() => {
        if (isHovering && videoRef.current && appDetails) {
            videoRef.current?.play();
            console.log(appDetails);

        }
    }, [ isHovering, videoRef, appDetails ]);


    useEffect(() => {
        const initiateFetch = async () => {
            await fetchAppIDDetails(app.appid);
        };

        if (isHovering) {
            const timeout = setTimeout(() => {
                initiateFetch();
            }, 500)

            return () => clearTimeout(timeout);
        }
    }, [ isHovering, hasFetched, appDetails ]);


    const fetchAppIDDetails = async (appid) => {
        if (currentAppDetails !== appDetails || !appDetails) {
            try {
                const response = await fetch(`${server}/library/gameDetails/${appid}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAppDetails(data.data.result.data || []);
                    setCurrentAppDetails(data.data.result.data);
                }
                setHasFetched(true);
            } catch (error) {
                console.error('Failed to fetch app details');
            }
        }
    };



    return (
        <div ref={ref} className={`card-wrapper ${scale === 0 ? 'sm' : scale === 1 ? 'md' : scale === 2 ? 'lg' : 'xl'}`} onClick={onClick} onMouseLeave={() => { setIsHovering(false); }} onMouseEnter={() => { setIsHovering(true); }}>
            <div className={`card-appid ${showAppID ? 'visible' : ''}`}>{app.appid}</div>
            <div className={`card-title ${showGameTitle ? 'visible' : ''}`}>{app.name}</div>

            {backlogged && <div className={`backlogged-overlay`}><BiCheckCircle className="backlogged-check" /></div>}

            <div className="card-reflection"></div>

            <div className={`card-details-wrapper ${isHovering && hasFetched ? 'visible' : 'hidden'}`}>
                <div className={`card-details-reflection ${hasFetched ?  'play' : ''}`}></div>
                <div className="body">
                    <div className="video-wrapper">
                        {appDetails?.movies && isHovering ?
                            <video className="video" preload="none" loop muted src={appDetails.movies[ 0 ].webm[ '480' ]} ref={videoRef}></video> : <img src={appDetails?.header_image} alt="" className="video" />
                        }
                    </div>
                </div>
                <div className="footer">
                    <p className="name">{app.name}</p>
                    <p className="developer">  <strong>Developer: </strong>
                        {appDetails?.developers?.length > 0
                            ? appDetails.developers[ 0 ]
                            : appDetails?.publishers?.length > 0
                                ? appDetails.publishers[ 0 ]
                                : 'N/A'}</p>
                    <p><strong>Release date: </strong>{appDetails?.release_date?.date || 'N/A'}</p>
                    <p><strong>AppID: </strong> {app.appid}</p>
                </div>
            </div>

            <ImageWithFallback
                root={ref}
                rootMargin={'1000px 0px 1000px 0px'}
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_600x900.jpg`}
                fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                className="hero-capsule"
            />
        </div>
    );
}));

export default CardWrapper;
