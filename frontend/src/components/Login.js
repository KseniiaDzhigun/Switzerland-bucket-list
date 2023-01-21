import React, { useState } from 'react';

const Login = ({ onLogin }) => {
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
        onLogin({ password, email });
    }

    return (
        <main className="content">
            <section className="sign">
                <h2 className="sign__title">Вход</h2>
                <form className="sign__form" onSubmit={handleSubmit} >
                    <fieldset className="sign__form-set">
                        <input value={userData.email} onChange={handleChange} id="email-input" type="email" name="email" placeholder="Email"
                            className="sign__input sign__input_type_email" minLength="3" maxLength="30" required />
                        <input value={userData.password} onChange={handleChange} id="password-input" type="password" name="password" placeholder="Пароль"
                            className="sign__input sign__input_type_password" required />
                        <button type="submit" className="sign__submit-button">Войти</button>
                    </fieldset>
                </form>
            </section>
        </main>
    );
}

export default Login;