import { Link, Switch, Route } from 'react-router-dom';
import logo from '../images/header-logo-bucketlist.svg';

//The header will display different links depending on the page we are on: "Register", "Login", "[email user] Logout"

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
                        <Link to="/sign-up" className="header__link">SIGN UP</Link>
                    </Route>
                    <Route path="/sign-up">
                        <Link to="/sign-in" className="header__link">SIGN IN</Link>
                    </Route>
                    <Route exact path="/">
                        <p className="header__user-email">{email}</p>
                        <Link to="/sign-in" onClick={onLogout} className="header__link header__link_type_logout">SIGN OUT</Link>
                    </Route>
                </Switch>
            </div>
        </header>
    );
}

export default Header;