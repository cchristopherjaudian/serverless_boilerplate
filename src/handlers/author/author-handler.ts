import ApiGateway, { INormalizedEvents } from '../../lib/api-gateway-response';
import Middleware from '../../lib/middleware/handler-middleware';
import AuthorService, { TAuthorPayload } from '../../services/author-service';
import AuthorModel from '../../../database/models/author';
import { ResponseCodes } from '../../../commons/constants/response-contants';
import { ResponseStatus } from '../../../commons/constants/response-status';
import logger from '../../../commons/logger';
import { createAuthorSchema } from '../../lib/request-schemas/author-request';

// Class Instance
const mwInstance = new Middleware();
const lambdaGateway = new ApiGateway();
const authorInstance = new AuthorService(AuthorModel);

const createAuthor = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  logger.info('handler: initializing createTodo....');

  logger.info('handler: initializing createAuthor...');
  const gatewayData = await lambdaGateway.to(authorInstance.createAuthor(event.body));

  logger.info('handler: author created...');
  return lambdaGateway.end(ResponseStatus.CREATED, ResponseCodes.DATA_CREATED, gatewayData);
}, createAuthorSchema);

const listAllAuthors = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  logger.info('handler: initializing listAllAuthors....');

  logger.info('handler: initializing getAllAuthors...');
  const gatewayData = await lambdaGateway.to(authorInstance.getAllAuthors(event.queryStringParameters));

  logger.info('handler: authors fetched...');
  return lambdaGateway.end(ResponseStatus.SUCCESS, ResponseCodes.LIST_RETRIEVED, gatewayData);
});

const getAuthorData = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  logger.info('handler: initializing getAuthorData....');

  logger.info('handler: initializing findOneAuthor...');
  const gatewayData = await lambdaGateway.to(authorInstance.findOneAuthor(event.pathParameters));

  logger.info('handler: author fetched...');
  return lambdaGateway.end(ResponseStatus.SUCCESS, ResponseCodes.DATA_RETRIEVED, gatewayData);
});

const updateAuthorData = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  logger.info('handler: initializing updateAuthorData....');

  logger.info('handler: initializing updateAuthor...');
  const gatewayData = await lambdaGateway.to(authorInstance.updateAuthor(event.pathParameters.id, event.body));

  logger.info('handler: author updated...');
  return lambdaGateway.end(ResponseStatus.SUCCESS, ResponseCodes.DATA_UPDATED, gatewayData);
});

const deleteAuthorData = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  logger.info('handler: initializing deleteAuthorData....');

  logger.info('handler: initializing deleteAuthor...');
  const gatewayData = await lambdaGateway.to(authorInstance.deleteAuthor(event.pathParameters.id));

  logger.info('handler: author deleted...');
  return lambdaGateway.end(ResponseStatus.SUCCESS, ResponseCodes.DATA_DELETED, gatewayData);
});

export { createAuthor, listAllAuthors, getAuthorData, updateAuthorData, deleteAuthorData };
