import React from 'react';
import { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import '../css/Modal.css';
const Modal = React.memo(({ isOpen, onClose, title, body, footer, className }) => {
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
                <div className={className}>
                    <span className="modal-top">
                        <h4 className="modal-title">{title}</h4>
                        <button onClick={onClose} className='modal-close-btn'><RxCross2></RxCross2></button>
                    </span>
                    <div className="modal-body">{body}</div>
                    <div className="modal-footer">{footer}</div>
                </div>
                <div className={`modal-backdrop ${visible ? 'visible' : 'hidden'}`} onClick={onClose}></div>
            </>
        )
})

export default Modal;