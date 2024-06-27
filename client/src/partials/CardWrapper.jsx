import React, { forwardRef } from "react";
import ImageWithFallback from "./ImageWithFallback";
import '../css/CardWrapper.css'
const CardWrapper = forwardRef(({ app, onClick, showAppID, showGameTitle }, ref) => {

    return (
        <div ref={ref} className="card-wrapper" onClick={onClick}>
            <div className={`card-appid ${showAppID === true ? 'visible' : ''}`}>{app.appid}</div>
            <div className={`card-title ${showGameTitle === true ? 'visible' : ''}`}>{app.name}</div>
            <ImageWithFallback
                root={ref}
                rootMargin={'1000px 0px 1000px 0px'}
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_600x900.jpg`}
                fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                className="hero-capsule"
            />
        </div>
    );
});

export default CardWrapper;
