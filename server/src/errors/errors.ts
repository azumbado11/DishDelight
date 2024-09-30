export class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.message = 'ConnectionError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
