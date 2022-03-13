import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api.js';
import PageNotFound from './PageNotFound';
import Register from './Register';
import Login from './Login';
import CurrentUserContext from '../contexts/CurrentUserContext';

import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

import ProtectedRoute from './ProtectedRoute';


function App() {
  const [cards, setCards] = useState([]);
//получаем массив карточек
  useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => console.log(err));

  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    // Отправляем запрос в API и удаляем карточку 
    api
      .deleteCard(card._id)
      .then((newCard) => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(card) {
    const name = card.name;
    const link = card.link;
    setIsSubmitting(true);
    // buttonText = "Сохраняется...";
    // Отправляем запрос в API и добавляем карточку 
    api
      .postCreateCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(
        () =>{
          setIsSubmitting(false);
          // buttonText = "Сохранить";
        }
      );
  }

//  Отправляем запрос в API и устанавливаем текущего юзера
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    api
      .getUser()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(err));
  }, []);


// открытие всплывающих попапов
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false)
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)
   // ...(на submit)
 const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true)
  }
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  }
  const handleConfirmClick = () => {
    setIsConfirmPopupOpen(true)
  }
  const handleImagePopupOpen = () => {
    setIsImagePopupOpen(true)
  }
  const handleInfoTooltipOpen = () => {
    setIsInfoTooltipOpen(true)
  }

  //открываем попап с картинкой
  const [selectedCard, setSelectedCard] = useState({});
  const handleCardClick = (card) => {
    setSelectedCard(card)       //передаем  данные карточки
    setIsImagePopupOpen(true)   //открываем попап скартинкой
  };

  //закрываем все попапы
  const closeAllPopups = () => {
    // console.log('closeAllPopups');
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
  };

// кнопка Escape
  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }
    document.addEventListener('keydown', closeByEscape)
    return () => document.removeEventListener('keydown', closeByEscape)
}, [])

  // Функция обновления пользователя 
  function handleUpdateUser(user) {
    setIsSubmitting(true);
    // buttonText = "Сохраняется...";
    api
      .postUser(user)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(
        () =>{
          setIsSubmitting(false);
          // buttonText = "Сохранить";
        }
      );
  }

  // Функция обновления аватара 
  function handleUpdateAvatar(avatar) {
    setIsSubmitting(true);
    // buttonText = "Сохраняется...";
    api
      .postAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(
        () =>{
          setIsSubmitting(false);
          // buttonText = "Сохранить";
        }
      );
  }

  //Регистрация
  const [loggedIn, setLoggedIn] = useState(true)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  })
  const history = useHistory();
  
  // useEffect(() => tokenCheck(), [])
  useEffect(() => {
    if (loggedIn) {
      history.push('/sign-in');
    }
  }, [loggedIn])

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Switch>

        <ProtectedRoute 
          path="/sign-up" 
          loggedIn={loggedIn} 
          component={Register} 
        />
        <ProtectedRoute 
          path="/sign-in" 
          loggedIn={loggedIn} 
          userData={userData} 
          component={Login} 
        />

            <Route exact path="/">
                <main className="content">        
                  <Main
                    handleEditAvatarClick={handleEditAvatarClick}
                    handleEditProfileClick={handleEditProfileClick}
                    handleAddPlaceClick={handleAddPlaceClick}
                    handleConfirmClick={handleConfirmClick}
                    handleImagePopupOpen={handleImagePopupOpen}
                    handleCardClick={handleCardClick}

                    cards={cards}
                    handleCardLike={handleCardLike}
                    handleCardDelete={handleCardDelete}
                  />
                </main>
                <Footer />
            </Route>

            <Route exact path="/sign-up">
              <Register />
            </Route>
            <Route exact path="/sign-in">
              <Login />
            </Route> 

            {/* <Route exact path="/">
              {loggedIn ? ( <Redirect to="/" />) : (<Redirect to="/sign-in" />)}
            </Route> */}

            {/* стр не найдена */}
            {/* <Route path='*'>
              <PageNotFound />
            </Route> */}
        </Switch>
       
        {/* /попап для успешной/не успешной регистрации */}
        <InfoTooltip 
          onClose={closeAllPopups}
          isOpen={isInfoTooltipOpen}
        />
 
        {/* /попап для картинки карточки */}
        <ImagePopup 
          onClose={closeAllPopups}
          isOpen={isImagePopupOpen}
          name={selectedCard.name}
          link={selectedCard.link}
        />
        {/* попап Редактировать профиль */}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          IsSubmit={isSubmitting}
        />
        {/* попап добавления карточки       */}
        <AddPlacePopup
          onClose={closeAllPopups}
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          IsSubmit={isSubmitting}
        />
        {/* попап Обновить аватар       */}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          IsSubmit={isSubmitting}
        />

        {/* попап с удалением карточки */}
        <PopupWithForm onClose={closeAllPopups}
          isOpen={isConfirmPopupOpen}
          title='Вы уверены?'
          name='confirmation'
          buttonText='Сохранить'
        >
        </PopupWithForm>

      </CurrentUserContext.Provider>
  );
}

export default App;
