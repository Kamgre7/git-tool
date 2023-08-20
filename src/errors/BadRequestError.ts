import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string, code: number = 400) {
    super(message, code);
  }
}
