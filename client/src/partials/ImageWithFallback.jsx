import React from 'react';
import { useState } from 'react';
import { memo } from 'react';

const ImageWithFallback = memo(({ src, alt, fallbackSrc, ...props }) => {
    const [ imgSrc, setImgSrc ] = useState(src);

    const handleError = () => {
        setImgSrc(fallbackSrc);
    }

    return (
        <img src={imgSrc} alt={alt} onError={handleError} {...props} />
    )
})

export default ImageWithFallback;
