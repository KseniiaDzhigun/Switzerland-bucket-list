import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete}) {

    const currentUser = useContext(CurrentUserContext);

    const isOwn = card.owner._id === currentUser._id;

    const isLiked = card.likes.some(id => id === currentUser._id);

    //Задаём обработчику (пробрасывается в виде пропса через Main и App) нужное значение с данными карточки
    const handleCardClick = () => {
        onCardClick(card);
    }

    const handleLikeButtonClick = () => {
        onCardLike(card);
    }

    const handleTrashButtonClick = () => {
        onCardDelete(card);
    }

    return (
        <li className="cards__element">
            <img src={card.link} alt={card.name} className="cards__image" onClick={handleCardClick} />
            <button type="button" className={`cards__trash-button ${isOwn ? "cards__trash-button_visible" : ''}`} onClick={handleTrashButtonClick} ></button>
            <div className="cards__caption">
                <h3 className="cards__title">{card.name}</h3>
                <div className="cards__like">
                    <button type="button" className={`cards__like-button ${isLiked ? "cards__like-button_active" : ''}`} onClick={handleLikeButtonClick}></button>
                    <p className="cards__like-counter">{card.likes.length}</p>
                </div>
            </div>
        </li>
    );
}

export default Card;