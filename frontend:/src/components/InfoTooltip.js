import React from 'react';
import iconSuccessful from '../images/InfoTooltip-successful.svg';
import iconRejected from '../images/InfoTooltip-rejected.svg';

//Компонент модального окна,который информирует пользователя об успешной (или не очень) регистрации

function InfoTooltip({ isOpen, onClose, isSuccessful }) {
    return (
        <section className={`popup popup_type_info ${isOpen ? "popup_opened" : ''}`}>
            <div className="popup__content popup__content_type_info">
                <button type="button" className="popup__close-button" onClick={onClose}></button>
                <div className="popup__info">
                    <img src={isSuccessful ? iconSuccessful : iconRejected} alt="Статус регистрации" className="popup__info-image" />
                    <p className="popup__info-message">{isSuccessful ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</p>

                </div>
            </div>
        </section>
    );
}

export default InfoTooltip;