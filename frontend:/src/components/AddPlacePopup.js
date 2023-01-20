import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    const [buttonName, setButtonName] = useState('');

    useEffect(() => {
        isOpen && setButtonName('Сохранить');
        setName('');
        setLink('');
    }, [isOpen])

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        setButtonName('Сохранение...')

        // Передаём значения управляемых компонентов во внешний обработчик
        onAddPlace({
            name,
            link,
        });
    }

    return (
        <PopupWithForm
            title="Новое место"
            name="add"
            button={buttonName}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input value={name} onChange={handleNameChange} id="place-input" type="text" name="name" placeholder="Название"
                className="popup__input popup__input_type_place" minLength="2" maxLength="30" required />
            <span className="place-input-error popup__error"></span>
            <input value={link} onChange={handleLinkChange} id="url-input" type="url" name="link" placeholder="Ссылка на картинку"
                className="popup__input popup__input_type_link" required />
            <span className="url-input-error popup__error"></span>
        </PopupWithForm>
    )
}

export default AddPlacePopup;