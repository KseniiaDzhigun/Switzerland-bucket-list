import { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as Auth from '../utils/Auth';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isInfoTooltipSuccessful, setIsInfoTooltipSuccessful] = useState(false);

  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('userId');
    if (token) {
      api.getInitialUserInfo().then((initialUserInfo) => {
        setCurrentUser(initialUserInfo);
      }).catch((err) => {
        console.log(`Ошибка: ${err}`)
      });
    }
  }, [loggedIn])

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleUpdateUser(data) {
    api.setUserInfo(data).then((updatedUserInfo) => {
      setCurrentUser(updatedUserInfo);
      closeAllPopups();
    }).catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
  }

  function handleUpdateAvatar(data) {
    api.changeAvatar(data).then((updatedUserInfo) => {
      setCurrentUser(updatedUserInfo);
      closeAllPopups();
    }).catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
  }

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data).then((newCard) => {
      //Обновляем стейт cards с помощью расширенной копии текущего массива, используя оператор ...
      //Новая карточка добавляется в начале списка
      setCards([newCard, ...cards]);
      closeAllPopups();
    }).catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
  }

  const [cards, setCards] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('userId');
    if (token) {
      api.getInitialCards().then((initialCards) => {
        setCards(initialCards.reverse());
      }).catch((err) => {
        console.log(`Ошибка: ${err}`)
      });
    }
  }, [loggedIn]) 

  function handleCardLike(card) {
    // Проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(id => id === currentUser._id);

    //Реакт перерисовает только карточку, на которую поставили/убрали лайк. При обновлении стейта передаем колбэк 
    //На вход идет значение текущего стейта, на выход — не совершенно новое, а обновленное значение карточек
    api.putLikeCard(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((currentCard) => currentCard._id === card._id ? newCard : currentCard));
    }).catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleCardDelete(card) {
    setSelectedCard(card);
    setIsConfirmDeletePopupOpen(true);
  }

  function handleConfirmDeleteCard() {
    api.deleteCard(selectedCard._id).then(() => {
      //После запроса в API, обновляем стейт cards с помощью метода filter: создаем копию массива, исключив из него удалённую карточку
      setCards(cards => cards.filter((cardItem) => cardItem._id !== selectedCard._id));
      closeAllPopups();
    }).catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
  }

  function authCheck() {
    const token = localStorage.getItem('userId');
    if (token) {
      // Запрос для проверки валидности токена и получения email для вставки в шапку сайта
      Auth.checkToken(token).then((res) => {
        if (res) {
          setLoggedIn(true);
          history.push('/');
        }
      }).catch((err) => {
        setLoggedIn(false);
        console.log(`Переданный токен некорректен : ${err}`)
      }).finally(() => {
        setLoading(false);
      })
    }
  }

  //Проверяем валидность токена при запуске/обновлении страницы только один раз
  useEffect(() => {
    authCheck()
  }, []);

  //Используем хук для перекидывания пользователя по страницам
  const history = useHistory();

  function handleRegister(data) {
    setLoading(true);
    Auth.register(data).then((res) => {
      if (res) {
        setIsInfoTooltipSuccessful(true);
        setIsInfoTooltipOpen(true);
        history.push('/sign-in');
      }
    }).catch(() => {
      setIsInfoTooltipSuccessful(false);
      setIsInfoTooltipOpen(true);
    }).finally(() => {
      setLoading(false);
    })
  }

  function handleLogin(data) {
    setLoading(true);
    Auth.login(data).then((res) => {
      //Сохраняем в localStorage id пользователя, так как токен приходит в куках
      localStorage.setItem('userId', res._id);
      setUserEmail(res.email);
      setLoggedIn(true);
      history.push('/');
    }).catch((err) => {
      setLoggedIn(false);
      console.log(`Пользователь не найден : ${err}`)
    }).finally(() => {
      setLoading(false);
    })
  }

  function handleLogout() {
    setLoading(true);
    Auth.signout().then((res) => {
      setLoggedIn(false);
      localStorage.removeItem('userId');
      history.push('/');
      setUserEmail('');
    }).catch((err) => {
      console.log(`Не удалось выйти из профиля: ${err}`)
    }).finally(() => {
      setLoading(false);
    })
  }

  if (loading) {
    return <div>...Loading</div>
  }


  //Вся функциональность приложения будет доступна только авторизованным пользователям по роуту /
  //Если неавторизованный пользователь приходит на сайт, он должен попадать на страницу входа, на какой бы роут он ни пришёл

  return (
    //Используем данные из currentUser для всех элементов с помощью провайдера контекста
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header alt="логотип Mesto Russia" email={userEmail} onLogout={handleLogout} />
        <Switch>

          <ProtectedRoute exact path="/"
            component={Main}
            alt="Аватар пользователя"
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={loggedIn}
          >
          </ProtectedRoute>

          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
          </Route>

          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
          </Route>

        </Switch>

        <Footer year="2022" name="Mesto Russia" />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <ImagePopup
          isOpen={isImagePopupOpen}
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <ConfirmDeletePopup isOpen={isConfirmDeletePopupOpen} onClose={closeAllPopups} onConfirmDelete={handleConfirmDeleteCard} />

        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} isSuccessful={isInfoTooltipSuccessful} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
