import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { ResponseCodes } from '../../commons/constants/response-contants';
import { ResponseStatus } from '../../commons/constants/response-status';
type ResponseError = {
  statusCode?: string;
  status?: number;
  message?: string;
  stack?: string;
};

export interface NormalizedEvents<T> {
  queryStringParameters: { [name: string]: string };
  pathParameters: { [name: string]: string };
  body: T;
}

class ApiGateway {
  private _status: number = ResponseStatus.INTERNAL_SERVER_ERROR;
  private _statusCode: string = ResponseCodes.INTERNAL_SERVER_ERROR;
  private _response: Record<string, unknown> | unknown;

  public setApigateway(
    status?: number,
    statusCode?: string,
    response?: Record<string, unknown> | (Error & ResponseError),
  ): this {
    this._status = status as number;
    this._statusCode = statusCode as string;
    this._response = response;

    return this;
  }

  public end(): APIGatewayProxyResult {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      statusCode: this._status,
      body: JSON.stringify({
        status: this._status,
        code: this._statusCode,
        data: this._response,
      }),
    };
  }

  public onError(error: Error & ResponseError): APIGatewayProxyResult {
    let response;
    if (error instanceof Error) {
      error.status = error.status || ResponseStatus.INTERNAL_SERVER_ERROR;
      error.statusCode = error.statusCode || ResponseCodes.INTERNAL_SERVER_ERROR;
      response = { message: error.message, stack: error.stack };
    }
    return this.setApigateway(error.status, error.statusCode, response as Record<string, unknown>).end();
  }

  public async to(asyncFunction: any): Promise<Record<string, unknown> | APIGatewayProxyResult> {
    return Promise.resolve(asyncFunction).catch(this.onError);
  }
}

export default ApiGateway;
