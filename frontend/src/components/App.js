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
        console.log(`Error: ${err}`)
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
      console.log(`Error: ${err}`)
    });
  }

  function handleUpdateAvatar(data) {
    api.changeAvatar(data).then((updatedUserInfo) => {
      setCurrentUser(updatedUserInfo);
      closeAllPopups();
    }).catch((err) => {
      console.log(`Error: ${err}`)
    });
  }

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data).then((newCard) => {
      //Update the cards state using an extended copy of the current array, using operator ...
      //The new card is added at the beginning of the list
      setCards([newCard, ...cards]);
      closeAllPopups();
    }).catch((err) => {
      console.log(`Error: ${err}`)
    });
  }

  const [cards, setCards] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('userId');
    if (token) {
      api.getInitialCards().then((initialCards) => {
        setCards(initialCards.reverse());
      }).catch((err) => {
        console.log(`Error: ${err}`)
      });
    }
  }, [loggedIn])

  function handleCardLike(card) {
    const isLiked = card.likes.some(id => id === currentUser._id);

    //React only redraws the card that was liked. When updating the state, pass the callback 
    api.putLikeCard(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((currentCard) => currentCard._id === card._id ? newCard : currentCard));
    }).catch((err) => {
      console.log(`Error: ${err}`)
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
      //After a request to the API, update the cards state with filter method: create a copy of the array, excluding the deleted card
      setCards(cards => cards.filter((cardItem) => cardItem._id !== selectedCard._id));
      closeAllPopups();
    }).catch((err) => {
      console.log(`Error: ${err}`)
    });
  }

  function authCheck() {
    const token = localStorage.getItem('userId');
    if (token) {
      Auth.checkToken(token).then((res) => {
        if (res) {
          setUserEmail(res.email);
          setLoggedIn(true);
          history.push('/');
        }
      }).catch((err) => {
        setLoggedIn(false);
        console.log(`Token is incorrect : ${err}`)
      }).finally(() => {
        setLoading(false);
      })
    }
  }

  //Validating token on page startup/update only once
  useEffect(() => {
    authCheck()
  }, []);

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
      //Saving user id in localStorage, as the token comes in cookies
      localStorage.setItem('userId', res._id);
      setUserEmail(res.email);
      setLoggedIn(true);
      history.push('/');
    }).catch((err) => {
      setLoggedIn(false);
      console.log(`User is not found : ${err}`)
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
      console.log(`Unable to log out: ${err}`)
    }).finally(() => {
      setLoading(false);
    })
  }

  if (loading) {
    return <div>...Loading</div>
  }


  //All application functionality will only be available to authorised users via router /
  //If an unauthorised user comes to the site, they should be taken to the login page, whichever router they come to

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header alt="logo Switzerland Bucket List" email={userEmail} onLogout={handleLogout} />
        <Switch>

          <ProtectedRoute exact path="/"
            component={Main}
            alt="user avatar"
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

        <Footer year="2023" name="Switzerland Bucket List" />

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
