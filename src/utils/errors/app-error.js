class AppError extends Error {
  constructor(name, explaination, message, statusCode) {
    super();
    this.name = name;
    this.message = message;
    this.explaination = explaination;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;