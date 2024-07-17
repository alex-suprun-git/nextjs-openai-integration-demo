import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/new-user',
  '/statistics',
  '/journal',
  '/journal/new-entry',
  '/journal/[id]',
]);

export default clerkMiddleware((auth, req) => {
  const userId = auth().userId;
  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }
  // if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
