import React from 'react'
import ImageWithFallback from './ImageWithFallback'
const HeroPoster = React.memo(({ app }, modalWrapperRef) => {
    return (
        <div className="hero-poster">
            <ImageWithFallback root={modalWrapperRef.current}
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/library_600x900.jpg`}
                fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                className="hero-poster"
            />
        </div>
    )
})

export default HeroPoster;