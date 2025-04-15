import { routing } from './i18n/routing';
import { chainMiddlewares } from './middlewares/chainMiddlewares';
import { authMiddleware } from './middlewares/clerk-middleware';

export default chainMiddlewares([authMiddleware]);

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
