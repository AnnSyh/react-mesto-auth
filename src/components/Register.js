import React from 'react';
import { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { Link } from 'react-router-dom';


function Register() {

  function handleSubmit(evt) {
    evt.preventDefault(evt);
    

  }
  
  return (
    <div className="sign-up">
      <form
      className="form popup__form popup__form_inverse form__sign-up"
      title='Регистрация'
      name='form-registration'
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="page-title popup__page-title  text-overflow text-center">Регистрация</h2>
        <div className="form__field">
          <input 
              placeholder="E-mail" 
              id="mail-input" 
              className="popup__input popup__input_mail" 
              name="mail" 
              required 
              minLength="2" 
              maxLength="30" 
          />
          <span className="popup__input-error place-title-input-error"></span>
        
        </div>
        <div className="form__field">
          <input 
            placeholder="Пароль" 
            id="pass-input" 
            className="popup__input popup__input_pass" 
            name="pass" 
            required 
            type="pass" 
          />
        <span className="popup__input-error place-title-input-error"></span>
        </div>
      </div>
      <div className="form__field m-0">
        <button className="popup__btn"
                          name="btn"
                          type="submit">Зарегистрироваться</button>
       <div className="link text-center">
        Уже зарегистрированы? <Link to="/sign-in" className="link"> Войти</Link>
       </div>
      </div>
    </form>

    </div>
  );
}

export default Register;
