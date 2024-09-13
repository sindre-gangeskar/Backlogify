import React, { useState, useEffect, forwardRef, useRef } from "react";
import ImageWithFallback from "./ImageWithFallback";
import { BiCheckCircle } from "react-icons/bi";
import '../css/CardWrapper.css';
const CardWrapper = React.memo(forwardRef(({ app, onClick, showAppID, showGameTitle, scale, backlogged }, ref) => {

    return (
        <div ref={ref} className={`card-wrapper ${scale === 0 ? 'sm' : scale === 1 ? 'md' : scale === 2 ? 'lg' : 'xl'}`} onClick={onClick}>
            <div className={`card-appid ${showAppID ? 'visible' : ''}`}>{app.appid}</div>
            <div className={`card-title ${showGameTitle ? 'visible' : ''}`}>{app.name}</div>

            {backlogged && <div className={`backlogged-overlay`}><BiCheckCircle className="backlogged-check" /></div>}

            <div className="card-reflection"></div>

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
