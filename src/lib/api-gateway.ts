import { APIGatewayProxyResult } from 'aws-lambda';
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

type NormalizedApiGateway = Omit<APIGatewayProxyResult & ResponseError, 'statusCode'>;
type NormalizedResponseError = Error & ResponseError;

const headers = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};
class ApiGateway {
  end(status: number, statusCode: string, response: NormalizedApiGateway): APIGatewayProxyResult {
    console.log('executing {end} lambda gateway...', response);
    return {
      statusCode: status !== ResponseStatus.SUCCESS ? ResponseStatus.INTERNAL_SERVER_ERROR : status,
      headers,
      body: JSON.stringify({
        status,
        code: statusCode,
        data: response,
      }),
      isBase64Encoded: false,
    };
  }

  onError(error: NormalizedResponseError): APIGatewayProxyResult {
    console.log('executing {onError} lambda gateway...');
    const response = { message: error.message, stack: error.stack };
    const status = error.status || ResponseStatus.INTERNAL_SERVER_ERROR;
    const statusCode = error.statusCode || ResponseCodes.INTERNAL_SERVER_ERROR;

    return this.end(status, statusCode, response as NormalizedApiGateway);
  }

  public async to(asyncFunction: any): Promise<Record<string, unknown> | APIGatewayProxyResult> {
    const value = await Promise.resolve(asyncFunction);
    return new Promise((resolve, reject) => {
      if (value instanceof Error) {
        reject(this.onError(value));
      }

      resolve(value);
    });
  }
}

export default ApiGateway;
