import React from 'react';
import '../css/Modal.css';
const Modal = React.memo(({ isOpen, onClose, title, body, footer, className }) => {
    if (!isOpen) return null;
    
    else
        return (
            <div className={className}>
                <span className="modal-top">
                    <h4 className="modal-title">{title}</h4>
                    <button onClick={onClose} className='modal-close-btn'>X</button>
                </span>
                <div className="modal-body">{body}</div>
                <div className="modal-footer">{footer}</div>
            </div>
        )
})

export default Modal;