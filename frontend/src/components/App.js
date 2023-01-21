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
    api.getInitialUserInfo().then((initialUserInfo) => {
      setCurrentUser(initialUserInfo);
    }).catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
  }, [])

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
    api.getInitialCards().then((initialCards) => {
      setCards(initialCards);
    }).catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
  }, []) //Передаем в зависимости пустой массив, эффект будет вызван всего один раз

  function handleCardLike(card) {
    // Проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(likeElement => likeElement._id === currentUser._id);

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

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      // Запрос для проверки валидности токена и получения email для вставки в шапку сайта
      Auth.checkToken(jwt).then((res) => {
        if (res) {
          setUserEmail(res.data.email);
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
    tokenCheck()
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
      if (res.token) {
        //Сохраняем в localStorage jwt токен который прилетает с сервера
        localStorage.setItem('jwt', res.token);
        setLoggedIn(true);
        history.push('/');
      }
    }).catch((err) => {
      setLoggedIn(false);
      console.log(`Пользователь не найден : ${err}`)
    }).finally(() => {
      setLoading(false);
    })
  }

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/');
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
