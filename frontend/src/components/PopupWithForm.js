import React from 'react';

function PopupWithForm({ title, name, children, button, isOpen, onClose, onSubmit }) {
    return (
        <section className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ''}`}>
            <div className="popup__content popup__content_type_form">
                <button type="button" className="popup__close-button" onClick={onClose}></button>
                <form name={name} className="popup__form" onSubmit={onSubmit} >
                    <fieldset className="popup__form-set">
                        <h3 className="popup__title">{title}</h3>
                        {children}
                        <button type="submit" className={`popup__button-submit popup__button-submit_type_${name}`}>{button}</button>
                    </fieldset>
                </form>
            </div>
        </section>
    );
}

export default PopupWithForm;