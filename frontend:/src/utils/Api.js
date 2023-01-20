//Класс Api отвечает за работу с API, методы этого класса - запросы к серверу

class Api {
  constructor(setting) {
    this._address = setting.baseUrl;
    this._headers = setting.headers;
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`)
  }

  getInitialUserInfo() {
    return fetch(`${this._address}/users/me`, {
      method: "GET",
      headers: this._headers,
    })
      .then(this._handleResponse);
  }

  getInitialCards() {
    return fetch(`${this._address}/cards`, {
      method: "GET",
      headers: this._headers,
    })
      .then(this._handleResponse);
  }


  getInitialData() {
    return Promise.all([this.getInitialUserInfo(), this.getInitialCards()]);
  }


  setUserInfo(data) {
    return fetch(`${this._address}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then(this._handleResponse);
  }

  addNewCard(data) {
    return fetch(`${this._address}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then(this._handleResponse);
  }

  deleteCard(id) {
    return fetch(`${this._address}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then(this._handleResponse);
  }

  _addLikeCard(id) {
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    })
      .then(this._handleResponse);
  }

  _removeLikeCard(id) {
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then(this._handleResponse);
  }

  //В зависимости от того, есть ли уже лайк на карточке ставим лайк или убираем лайк
  putLikeCard(id, isLiked) {
    if (isLiked) {
      return this._removeLikeCard(id);
    } else {
      return this._addLikeCard(id);
    }
  }

  changeAvatar(data) {
    return fetch(`${this._address}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then(this._handleResponse);
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-50',
  headers: {
    authorization: 'a5a02e60-10c8-46a9-914b-480856b1458a',
    'Content-Type': 'application/json'
  }
});

export default api;