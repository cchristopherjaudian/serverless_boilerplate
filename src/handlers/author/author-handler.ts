import ApiGateway, { NormalizedEvents } from '../../lib/api-gateway';
import Middleware from '../../lib/middleware/handler-middleware';
import AuthorService, { TAuthorPayload } from '../../services/author-service';
import AuthorModel from '../../../database/models/author';

// Class Instance
const mwInstance = new Middleware();
const lambdaGateway = new ApiGateway();
const authorInstance = new AuthorService(AuthorModel);

const createAuthor = mwInstance.execMiddlewares(async (event: NormalizedEvents<TAuthorPayload>) => {
  console.log('initializing createTodo....');

  const newAuthor = await lambdaGateway.to(authorInstance.createAuthor(event.body));

  return lambdaGateway.setApigateway(200, 'Nice', newAuthor as Record<string, unknown>).end();
});

module.exports = { createAuthor };
