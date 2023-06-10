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

class ApiGateway {
  end(
    status: number,
    statusCode: string,
    response: NormalizedApiGateway | NormalizedResponseError,
  ): APIGatewayProxyResult {
    console.log('executing {end} lambda gateway...');

    if (response instanceof Error) {
      status = response.status || ResponseStatus.INTERNAL_SERVER_ERROR;
      statusCode = response.statusCode || ResponseCodes.INTERNAL_SERVER_ERROR;
      response = { message: response.message, stack: response.stack } as NormalizedResponseError;
    }

    return {
      statusCode: status,
      body: JSON.stringify(
        {
          status,
          code: statusCode,
          data: response,
        },
        null,
        2,
      ),
    };
  }

  public async to(asyncValue: any): Promise<[Error, null] | [null, APIGatewayProxyResult]> {
    const value = await Promise.resolve(asyncValue);
    return new Promise((resolve) => {
      if (value instanceof Error) {
        return resolve([value, null]);
      }

      resolve([null, value]);
    });
  }
}

export default ApiGateway;
