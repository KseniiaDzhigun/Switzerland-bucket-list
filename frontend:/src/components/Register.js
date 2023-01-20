import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
    const [userData, setUserData] = useState({
        password: '',
        email: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        let { password, email } = userData;
        e.preventDefault();
        onRegister({ password, email });
    }

    return (
        <main className="content">
            <section className="sign">
                <h2 className="sign__title">Регистрация</h2>
                <form className="sign__form" onSubmit={handleSubmit} >
                    <fieldset className="sign__form-set">
                        <input value={userData.email} onChange={handleChange} id="email-input" type="email" name="email" placeholder="Email"
                            className="sign__input sign__input_type_email" minLength="3" maxLength="30" required />
                        <input value={userData.password} onChange={handleChange} id="password-input" type="password" name="password" placeholder="Пароль"
                            className="sign__input sign__input_type_password" required />
                        <button type="submit" className="sign__submit-button">Зарегистрироваться</button>
                    </fieldset>
                </form>
                <div className="sign__login">
                    <p className="sign__login-text">Уже зарегистрированы?</p>
                    <Link to="/sign-in" className="sign__login-link">Войти</Link>
                </div>
            </section>
        </main>
    );
}

export default Register;