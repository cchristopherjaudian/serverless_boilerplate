import ApiGateway, { NormalizedEvents } from '../../lib/api-gateway';
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

const createAuthor = mwInstance.execMiddlewares(async (event: NormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing createTodo....');

  console.log('handler: initializing createAuthor...');
  const [err, newAuthor] = await lambdaGateway.to(authorInstance.createAuthor(event.body));

  console.log('handler: author created...');
  return lambdaGateway.end(
    ResponseStatus.CREATED,
    ResponseCodes.DATA_CREATED,
    err || (newAuthor as APIGatewayProxyResult),
  );
});

const listAllAuthors = mwInstance.execMiddlewares(async (event: NormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing listAllAuthors....');

  console.log('handler: initializing getAllAuthors...');
  const [err, authors] = await lambdaGateway.to(authorInstance.getAllAuthors(event.queryStringParameters));

  console.log('handler: authors fetched...');
  return lambdaGateway.end(
    ResponseStatus.SUCCESS,
    ResponseCodes.LIST_RETRIEVED,
    err || (authors as APIGatewayProxyResult),
  );
});

const getAuthorData = mwInstance.execMiddlewares(async (event: NormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing getAuthorData....');

  console.log('handler: initializing findOneAuthor...');
  const [err, authorData] = await lambdaGateway.to(authorInstance.findOneAuthor(event.pathParameters));

  console.log('handler: author fetched...');
  return lambdaGateway.end(
    ResponseStatus.SUCCESS,
    ResponseCodes.DATA_RETRIEVED,
    err || (authorData as APIGatewayProxyResult),
  );
});

const updateAuthorData = mwInstance.execMiddlewares(async (event: NormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing updateAuthorData....');

  console.log('handler: initializing updateAuthor...');
  const [err, updatedAuthor] = await lambdaGateway.to(authorInstance.updateAuthor(event.pathParameters.id, event.body));

  console.log('handler: author updated...');
  return lambdaGateway.end(
    ResponseStatus.SUCCESS,
    ResponseCodes.DATA_UPDATED,
    err || (updatedAuthor as APIGatewayProxyResult),
  );
});

const deleteAuthorData = mwInstance.execMiddlewares(async (event: NormalizedEvents<TAuthorPayload>) => {
  console.log('handler: initializing deleteAuthorData....');

  console.log('handler: initializing deleteAuthor...');
  const [err, deletedAuthor] = await lambdaGateway.to(authorInstance.deleteAuthor(event.pathParameters.id));

  console.log('handler: author deleted...');
  return lambdaGateway.end(
    ResponseStatus.SUCCESS,
    ResponseCodes.DATA_DELETED,
    err || (deletedAuthor as APIGatewayProxyResult),
  );
});

export { createAuthor, listAllAuthors, getAuthorData, updateAuthorData, deleteAuthorData };
