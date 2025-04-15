import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/new-user(.*)',
  '/statistics(.*)',
  '/journal(.*)',
  '/journal/new-entry(.*)',
  '/journal/[id]',
]);

export const authMiddleware = () =>
  clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  });
