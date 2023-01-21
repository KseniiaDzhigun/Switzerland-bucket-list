import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function ConfirmDeletePopup({ isOpen, onClose, onConfirmDelete }) {

    const [buttonName, setButtonName] = useState('');

    useEffect(() => {
        isOpen && setButtonName('Да');
    }, [isOpen])

    function handleSubmit(e) {
        e.preventDefault();

        setButtonName('Удаление...')

        onConfirmDelete();
    }

    return (
        <PopupWithForm
            title="Вы уверены?"
            name="submit"
            children={''}
            button={buttonName}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        />
    )
}

export default ConfirmDeletePopup;