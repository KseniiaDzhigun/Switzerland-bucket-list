import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function ConfirmDeletePopup({ isOpen, onClose, onConfirmDelete }) {

    const [buttonName, setButtonName] = useState('');

    useEffect(() => {
        isOpen && setButtonName('Yes');
    }, [isOpen])

    function handleSubmit(e) {
        e.preventDefault();

        setButtonName('Deleting...')

        onConfirmDelete();
    }

    return (
        <PopupWithForm
            title="Delete this post?"
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