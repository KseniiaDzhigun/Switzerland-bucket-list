import React, { useRef, useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

    // Write the object returned by the hook into a variable
    const inputRef = useRef();

    const [buttonName, setButtonName] = useState('');

    useEffect(() => {
        isOpen && setButtonName('SAVE');

        inputRef.current.value = '';
    }, [isOpen])

    function handleSubmit(e) {
        e.preventDefault();

        setButtonName('Is loading...')

        onUpdateAvatar({
            avatar: inputRef.current.value,
        });
    }

    return (
        <PopupWithForm
            title="Update your avatar"
            name="avatar"
            button={buttonName}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            {/* Specifying the ref attribute to the input element => accessing the DOM element directly */}
            <input ref={inputRef} id="avatar-url-input" type="url" name="avatar" placeholder="Image link"
                className="popup__input popup__input_type_link" required />
            <span className="avatar-url-input-error popup__error"></span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;