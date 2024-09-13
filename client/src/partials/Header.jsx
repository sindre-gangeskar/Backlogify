import React from 'react'
import ImageWithFallback from './ImageWithFallback'
const Header = React.memo(({ app }, modalWrapperRef) => {
    return (
        <div className="header">
            <ImageWithFallback root={modalWrapperRef.current}
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                fallbackSrc={`https://steamcdn-a.akamaihd.net/steam/apps/${app.appid}/header.jpg`}
                className="hero-poster"
            />
        </div>
    )
})

export default Header;