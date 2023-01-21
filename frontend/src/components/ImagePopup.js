import React from 'react';

function ImagePopup({ isOpen, card, onClose }) {
    return (
        <section className={`popup popup_type_image ${isOpen ? "popup_opened" : ''}`}>
            <div className="popup__content popup__content_type_image">
                <button type="button" className="popup__close-button" onClick={onClose}></button>
                <figure className="popup__figure">
                    <img src={card?.link} alt={card?.name} className="popup__image" />
                    <figcaption className="popup__caption">{card?.name}</figcaption>
                </figure>
            </div>
        </section>
    );
}

export default ImagePopup;