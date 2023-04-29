/* eslint-disable @typescript-eslint/no-unused-vars */
import middleWare from 'middy';
import { jsonBodyParser, httpEventNormalizer, httpErrorHandler } from 'middy/middlewares';

class Middleware {
  public static validateHandler = (fn: any) => {
    return middleWare(fn).use(jsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler());
  };
}
export default Middleware;
