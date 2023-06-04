import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
class Middleware {
  public execMiddlewares(fn: any) {
    return middy(fn).use(httpEventNormalizer()).use(httpErrorHandler()).use(httpJsonBodyParser());
  }
}

export default Middleware;
