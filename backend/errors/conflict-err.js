// Конструктор наследует от стандартной ошибки и выставляет свойство statusCode

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
