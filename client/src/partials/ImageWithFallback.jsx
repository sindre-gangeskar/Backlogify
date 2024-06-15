import React from 'react';
import { useState } from 'react';

function ImageWithFallback({ src, alt, fallbackSrc, ...props }) {
    const [ imgSrc, setImgSrc ] = useState(src);

    const handleError = () => {
        setImgSrc(fallbackSrc);
    }

    return (
        <img src={imgSrc} alt={alt} onError={handleError} {...props} />
    )
}

export default ImageWithFallback;
