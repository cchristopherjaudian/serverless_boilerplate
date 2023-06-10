import { APIGatewayProxyResult } from 'aws-lambda';
import { ResponseCodes } from '../../commons/constants/response-contants';
import { ResponseStatus } from '../../commons/constants/response-status';

type TResponseError = {
  statusCode?: string;
  status?: number;
  message?: string;
  stack?: string;
};

export interface INormalizedEvents<T> {
  queryStringParameters: { [name: string]: string };
  pathParameters: { [name: string]: string };
  body: T;
}

type TNormalizedApiGateway = Omit<APIGatewayProxyResult & TResponseError, 'statusCode'>;
type TNormalizedResponseError = Error & TResponseError;
type TGatewayResponse = [TNormalizedResponseError | null, TNormalizedApiGateway | null];

class ApiGateway {
  end(status: number, statusCode: string, [err, response]: TGatewayResponse): APIGatewayProxyResult {
    console.log('executing {end} lambda gateway...');

    let errorReponse;
    if (err instanceof Error) {
      status = err.status || ResponseStatus.INTERNAL_SERVER_ERROR;
      statusCode = err.statusCode || ResponseCodes.INTERNAL_SERVER_ERROR;
      errorReponse = { message: err.message, stack: err.stack } as TNormalizedResponseError;
    }

    return {
      statusCode: status,
      body: JSON.stringify(
        {
          status,
          code: statusCode,
          data: response || errorReponse,
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
