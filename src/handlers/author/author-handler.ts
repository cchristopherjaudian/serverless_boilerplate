import ApiGateway, { INormalizedEvents } from '../../lib/api-gateway-response';
import Middleware from '../../lib/middleware/handler-middleware';
import AuthorService, { TAuthorPayload } from '../../services/author-service';
import AuthorModel from '../../../database/models/author';
import { ResponseCodes } from '../../../commons/constants/response-contants';
import { ResponseStatus } from '../../../commons/constants/response-status';
import { APIGatewayProxyResult } from 'aws-lambda';

// Class Instance
const mwInstance = new Middleware();
const lambdaGateway = new ApiGateway();
const authorInstance = new AuthorService(AuthorModel);

const createAuthor = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing createTodo....');

  console.log('handler: initializing createAuthor...');
  const gatewayData = await lambdaGateway.to(authorInstance.createAuthor(event.body));

  console.log('handler: author created...');
  return lambdaGateway.end(ResponseStatus.CREATED, ResponseCodes.DATA_CREATED, gatewayData);
});

const listAllAuthors = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing listAllAuthors....');

  console.log('handler: initializing getAllAuthors...');
  const gatewayData = await lambdaGateway.to(authorInstance.getAllAuthors(event.queryStringParameters));

  console.log('handler: authors fetched...');
  return lambdaGateway.end(ResponseStatus.SUCCESS, ResponseCodes.LIST_RETRIEVED, gatewayData);
});

const getAuthorData = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing getAuthorData....');

  console.log('handler: initializing findOneAuthor...');
  const gatewayData = await lambdaGateway.to(authorInstance.findOneAuthor(event.pathParameters));

  console.log('handler: author fetched...');
  return lambdaGateway.end(ResponseStatus.SUCCESS, ResponseCodes.DATA_RETRIEVED, gatewayData);
});

const updateAuthorData = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing updateAuthorData....');

  console.log('handler: initializing updateAuthor...');
  const gatewayData = await lambdaGateway.to(authorInstance.updateAuthor(event.pathParameters.id, event.body));

  console.log('handler: author updated...');
  return lambdaGateway.end(ResponseStatus.SUCCESS, ResponseCodes.DATA_UPDATED, gatewayData);
});

const deleteAuthorData = mwInstance.execMiddlewares(async (event: INormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing deleteAuthorData....');

  console.log('handler: initializing deleteAuthor...');
  const gatewayData = await lambdaGateway.to(authorInstance.deleteAuthor(event.pathParameters.id));

  console.log('handler: author deleted...');
  return lambdaGateway.end(ResponseStatus.SUCCESS, ResponseCodes.DATA_DELETED, gatewayData);
});

export { createAuthor, listAllAuthors, getAuthorData, updateAuthorData, deleteAuthorData };
