import ApiGateway from '../../lib/api-gateway';
import Middleware from '../../lib/middleware/handler-middleware';

const testRoute = Middleware.validateHandler(async (event: Record<string, unknown>) => {
  console.log('initializing createTodo....');
  return ApiGateway.end(200, 'test', {message: 'test'});
});

module.exports = {
  testRoute,
};
