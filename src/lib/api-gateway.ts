/* 

*/
import { ResponseCodes } from '../../commons/constants/response-contants';
import { ResponseStatus } from '../../commons/constants/response-status';
import { ResponseError } from '../models/error-model';

class ApiGateway  {
  public static end(
    status: number | undefined,
    statusCode: string | undefined,
    response: Record<string, unknown> | (Error & ResponseError), 
  ): Record<string, unknown> {
    if (response instanceof Error) {
      statusCode = response.statusCode;
      status = response.status;
      response = { message: response.message, stack: response.stack };
    }

    return {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      statusCode: status || ResponseStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        status,
        code: statusCode || ResponseCodes.INTERNAL_SERVER_ERROR,
        data: response,
      }),
    };
  }

  public static async to(asyncFunction: CallableFunction): Promise<[unknown, unknown]> {
    try {
      const functionValue = await asyncFunction();
      return [null, functionValue];
    } catch (error: unknown) {
      return [error, null];
    }
  }
}

export default ApiGateway;
