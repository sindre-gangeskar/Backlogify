import React, { forwardRef } from "react";
import { useInView } from "react-intersection-observer";
import ImageWithFallback from "./ImageWithFallback";
import '../css/CardWrapper.css'
const CardWrapper = forwardRef(({ app, onClick, showAppID }, ref) => {

    return (
        <div ref={ref} className={`card-wrapper visible`} onClick={onClick}>
            <div className={`card-appid ${showAppID === true ? 'visible' : ''}`}>{app.appid}</div>
            <div className="card-title">{app.name}</div>
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
