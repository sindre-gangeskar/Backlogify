import React from 'react';
import { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import '../css/Modal.css';
const Modal = React.memo(({ isOpen, onClose, title, body, footer, className, backdrop }) => {
    const [ visible, setVisible ] = useState(false);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setVisible(false);
    }, [ isOpen ])


    if (!isOpen) {
        return null;
    }

    else
        return (
            <>
                <div className={className} backdrop={backdrop}>
                    {title}
                    {body}
                    {footer}
                </div>

                {backdrop === 'true' ?
                    <div className={`modal-backdrop ${visible ? 'visible' : 'hidden'}`} onClick={onClose}></div>
                    : null}
            </>
        )
})

export default Modal;