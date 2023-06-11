import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import { Schema, ValidationError } from 'joi';
import ApiGateway, { TNormalizedResponseError } from '../api-gateway-response';
import logger from '../../../commons/logger';
import { ResponseStatus } from '../../../commons/constants/response-status';
import { ResponseCodes } from '../../../commons/constants/response-contants';

type TJoiSchema = {
  body?: Schema;
  queryStringParameters?: Schema;
  pathParameters?: Schema;
};

type TMiddyMiddleware = middy.MiddlewareObj<any, any, Error, any> | middy.MiddlewareObj<any, any, Error, any>[];

const gatewayInstance = new ApiGateway();
class Middleware {
  public execMiddlewares(fn: any, joiSchema?: TJoiSchema) {
    return middy(fn)
      .use(httpEventNormalizer())
      .use(httpErrorHandler())
      .use(httpJsonBodyParser())
      .use(this.validateRequest(joiSchema));
  }

  private validateRequest(joiSchema?: TJoiSchema): TMiddyMiddleware {
    const before = async ({ event }: middy.Request<any, any, Error, any>) => {
      logger.info('initializing {request} validation middleware....');
      if (!joiSchema) return;

      if (event?.body) {
        await this.validateSchema(joiSchema.body!, event.body);
      }
      if (event?.queryStringParameters) {
        await this.validateSchema(joiSchema.queryStringParameters!, event.queryStringParameters);
      }
      if (event?.pathParameters) {
        await this.validateSchema(joiSchema.pathParameters!, event.pathParameters);
      }
    };

    const onError = ({ error }: middy.Request<any, any, Error, any>) => {
      if (error) {
        const joiError = error as ValidationError;
        error.message = joiError.details[0].message;
        return gatewayInstance.end(ResponseStatus.BAD_REQUEST, ResponseCodes.BAD_REQUEST, [
          error as TNormalizedResponseError,
          null,
        ]);
      }
    };
    return {
      before,
      onError,
    };
  }

  private async validateSchema(joiSchema: Schema, body) {
    logger.info('initializing {validateSchema} middleware...');
    try {
      await joiSchema.validateAsync(body, { abortEarly: false });
    } catch (error) {
      logger.info('error occured in {validateSchema} middleware...');
      throw error;
    }
  }
}

export default Middleware;
