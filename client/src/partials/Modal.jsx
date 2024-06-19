import React from 'react';
import '../css/Modal.css';
function Modal({ isOpen, onClose, title, body, footer }) {
    if (!isOpen) return null;

    return (
        <div className="modal-wrapper">
            <span className="modal-top">
                <h4 className="modal-title">{title}</h4>
                <button onClick={onClose} className='modal-close-btn'>X</button>
            </span>
            <div className="modal-body">{body}</div>
            <div className="modal-footer">{footer}</div>
        </div>
    )
}

export default Modal;