export const BASE_URL = 'https://api.dzhigun.nomoredomains.rocks';
// export const BASE_URL = 'http://localhost:3000';

const handleResponse = (res) => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Error: ${res.status}`)
}

export const register = ({ password, email }) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email })
    })
        .then(handleResponse)
};

export const login = ({ password, email }) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email })
    })
        .then(handleResponse)
};

export const signout = () => {
    return fetch(`${BASE_URL}/signout`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(handleResponse)
};

export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(handleResponse)
}

