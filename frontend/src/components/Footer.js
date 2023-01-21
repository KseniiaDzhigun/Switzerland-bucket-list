import React from 'react';

function Footer({ year, name }) {
    return (
        <footer className="footer">
            <p className="footer__copyright">&copy; {year} {name}</p>
        </footer>
    );
}

export default Footer;