import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import logo from '../images/header-logo.svg';

//В хедере в зависимости от страницы, на которой мы находимся, будут отображаться разные ссылки: "Регистрация", "Войти", "[email пользователя] Выйти"

function Header({ alt, email, onLogout }) {
    return (
        <header className="header">
            <img
                src={logo}
                alt={alt}
                className="header__logo"
            />
            <div className="header__navigation">
                <Switch>
                    <Route path="/sign-in">
                        <Link to="/sign-up" className="header__link">Регистрация</Link>
                    </Route>
                    <Route path="/sign-up">
                        <Link to="/sign-in" className="header__link">Войти</Link>
                    </Route>
                    <Route exact path="/">
                        <p className="header__user-email">{email}</p>
                        <Link to="/sign-in" onClick={onLogout} className="header__link header__link_type_logout">Выйти</Link>
                    </Route>
                </Switch>
            </div>
        </header>
    );
}

export default Header;