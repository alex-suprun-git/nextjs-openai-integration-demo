import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/new-user(.*)',
  '/statistics(.*)',
  '/journal(.*)',
  '/journal/new-entry(.*)',
  '/journal/[id]',
]);

export const authMiddleware = () =>
  clerkMiddleware((auth, req) => {
    const userId = auth().userId;
    if (!userId && isProtectedRoute(req)) {
      return auth().redirectToSignIn();
    }
    // if (isProtectedRoute(req)) auth().protect();
  });
