import React from 'react';
import iconSuccessful from '../images/InfoTooltip-successful.svg';
import iconRejected from '../images/InfoTooltip-rejected.svg';

function InfoTooltip({ isOpen, onClose, isSuccessful }) {
    return (
        <section className={`popup popup_type_info ${isOpen ? "popup_opened" : ''}`}>
            <div className="popup__content popup__content_type_info">
                <button type="button" className="popup__close-button" onClick={onClose}></button>
                <div className="popup__info">
                    <img src={isSuccessful ? iconSuccessful : iconRejected} alt="Registration status" className="popup__info-image" />
                    <p className="popup__info-message">{isSuccessful ? 'You have successfully registered!' : 'Something went wrong! Try again.'}</p>

                </div>
            </div>
        </section>
    );
}

export default InfoTooltip;