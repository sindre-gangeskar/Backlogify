import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const ImageWithFallback = ({ src, alt, fallbackSrc, root, rootMargin, ...props }) => {
    const [ imgSrc, setImgSrc ] = useState(null);
    const [ hasLoaded, setHasLoaded ] = useState(false);
    const { ref, inView } = useInView({
        root: root || null,
        triggerOnce: true,
        threshold: 0.0,
        rootMargin: rootMargin || "0px 0px 0px 0px"
    });

    const handleError = () => {
        setImgSrc(fallbackSrc);
    }

    useEffect(() => {
        if (inView && !hasLoaded) {
            setImgSrc(src);
            setHasLoaded(true);
        }
    }, [ inView, src, hasLoaded ]);

    return (
        <img ref={ref} src={imgSrc} alt={alt} onError={handleError} {...props} />
    );
};

export default ImageWithFallback;
