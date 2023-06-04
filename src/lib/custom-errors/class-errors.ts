import { ResponseCodes } from '../../../commons/constants/response-contants';
import { ResponseStatus } from '../../../commons/constants/response-status';
import BaseError from './base-error';

class NotFoundError extends BaseError {
  private status: number;
  private statusCode: string;

  constructor(message: string) {
    super(message);

    this.statusCode = ResponseCodes.NOT_FOUND;
    this.status = ResponseStatus.NOT_FOUND;
  }
}

export { NotFoundError };
