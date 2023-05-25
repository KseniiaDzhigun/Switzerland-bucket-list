import React, { useState, useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen])

    const [buttonName, setButtonName] = useState('');

    useEffect(() => {
        isOpen && setButtonName('SAVE');
    }, [isOpen])


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        setButtonName('Is loading...')

        // Pass the values of controlled components to the external handler
        onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            title="Edit profile"
            name="edit"
            button={buttonName}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input value={name || ''} onChange={handleNameChange} id="name-input" type="text" name="name" className="popup__input popup__input_type_name" minLength="2"
                maxLength="40" required />
            <span className="name-input-error popup__error"></span>
            <input value={description || ''} onChange={handleDescriptionChange} id="about-input" type="text" name="about" className="popup__input popup__input_type_text" minLength="2"
                maxLength="200" required />
            <span className="about-input-error popup__error"></span>
        </PopupWithForm>
    );
}

export default EditProfilePopup;