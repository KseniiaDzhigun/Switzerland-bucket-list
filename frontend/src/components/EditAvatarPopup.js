import React, { useRef, useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
    
    // Записываем объект, возвращаемый хуком, в переменную
    const inputRef = useRef();

    const [buttonName, setButtonName] = useState('');

    useEffect(() => {
        isOpen && setButtonName('Сохранить');

        //Вызываем нужный метод на поле current объекта
        inputRef.current.value = '';
    }, [isOpen])

    function handleSubmit(e) {
        e.preventDefault();

        setButtonName('Сохранение...')

        onUpdateAvatar({
            avatar: inputRef.current.value,
        });
    }

    return (
        <PopupWithForm
            title="Обновить аватар"
            name="avatar"
            button={buttonName}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            {/* Указали элементу input атрибут ref => получили прямой доступ к DOM-элементу */}
            <input ref={inputRef} id="avatar-url-input" type="url" name="avatar" placeholder="Ссылка на картинку"
                className="popup__input popup__input_type_link" required />
            <span className="avatar-url-input-error popup__error"></span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;