import { useContext } from 'react';
import Card from './Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Main({ alt, onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {

    const currentUser = useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__info">
                    <div className="profile__avatar-overlay">
                        <img src={currentUser.avatar} alt={alt} className="profile__avatar" onClick={onEditAvatar} />
                    </div>
                    <div className="profile__text">
                        <div className="profile__name">
                            <h1 className="profile__title">{currentUser.name}</h1>
                            <button type="button" className="profile__button profile__button_type_edit" onClick={onEditProfile}></button>
                        </div>
                        <h2 className="profile__subtitle">{currentUser.about}</h2>
                    </div>
                </div>
                <button type="button" className="profile__button profile__button_type_add" onClick={onAddPlace}></button>
            </section>
            <section className="cards">
                <ul className="cards__elements">
                    {cards.map((card) => (<Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} /> ))}
                </ul>
            </section>
        </main>
    );
}

export default Main;

