import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const ImageWithFallback = ({ src, alt, fallbackSrc, root, rootMargin, ...props }) => {
    const [ imgSrc, setImgSrc ] = useState(null);
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
        if (inView)
            setImgSrc(src);
    }, [inView, src])


    return (
        <img ref={ref} src={imgSrc} alt={alt} onError={handleError} {...props} />
    );
};

export default ImageWithFallback;
