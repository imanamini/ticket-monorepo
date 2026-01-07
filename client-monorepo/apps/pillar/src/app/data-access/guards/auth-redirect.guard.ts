import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DigikalaAuthStateService } from '../services/digikala-auth-state.service';
import { STORAGE_KEY, StorageService } from '@client-monorepo/common/utilities';

export const authRedirectGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  const authStateService = inject(DigikalaAuthStateService);
  const storageService = inject(StorageService);

  // preserve original query params when redirecting
  const queryParams = state.root?.queryParams || {};
  const normalizedUrl = state.url.split('?')[0];

  // Check if user has been logged out (localStorage cleared)
  // If so, clear auth cache immediately to ensure fresh auth check
  const hasTokenInStorage = storageService.isLoggedIn();
  if (!hasTokenInStorage) {
    authStateService.clearCache();
  }

  // For protected routes (non-auth routes), verify token exists before checking auth state
  // This prevents race conditions where cached auth state might be stale
  if (!normalizedUrl.startsWith('/auth') && !hasTokenInStorage) {
    // User has no token and trying to access protected route - redirect to auth immediately
    return router.createUrlTree(['/auth'], { queryParams });
  }

  // Check authentication status
  // const isAuthenticated = await authStateService.resolveStatus();

  let isAuthenticated = await authStateService.resolveStatus();

  // Fallback: If Digikala auth says not authenticated, check regular storage
  // This handles the case where user has a valid token but no sa_token
  if (!isAuthenticated) {
    isAuthenticated = hasTokenInStorage;
  }

  if (isAuthenticated) {
    // If user is authenticated and trying to access auth page
    if (normalizedUrl.startsWith('/auth')) {
      // Check for 'rt' (redirect to) query parameter
      if (queryParams['rt']) {
        const redirectUrl = queryParams['rt'];
        const { rt, ...restParams } = queryParams;
        // Redirect immediately to the target URL
        return router.createUrlTree([redirectUrl], { queryParams: restParams });
      }

      // No rt parameter, redirect to home
      return router.createUrlTree(['/home'], { queryParams });
    }

    // Check if there's a stored redirect target from before login (for post-Digikala-auth flow)
    const beforeLoginRoute = storageService.getBeforeLoginRoute();

    if (normalizedUrl === '/' || normalizedUrl === '' || normalizedUrl === '/home') {
      if (beforeLoginRoute && beforeLoginRoute.url && beforeLoginRoute.url !== '') {
        // Clear the stored route to prevent infinite redirects
        sessionStorage.removeItem(STORAGE_KEY.DP_BEFORE_LOGIN_ROUTE);
        // Redirect to the stored route
        return router.createUrlTree([beforeLoginRoute.url], { queryParams: beforeLoginRoute.queryParams });
      }

      // Default: redirect to home if no stored route
      if (normalizedUrl !== '/home') {
        return router.createUrlTree(['/home'], { queryParams });
      }
    }
    return true;
  }

  // User is not authenticated
  if (normalizedUrl.startsWith('/auth')) {
    // Clear cache when user is not authenticated and navigating to auth
    authStateService.clearCache();

    // Store 'rt' parameter for post-login redirect
    if (queryParams['rt']) {
      const redirectUrl = queryParams['rt'];
      const { rt, ...restParams } = queryParams;
      storageService.storeBeforeLoginRoute({
        url: redirectUrl,
        queryParams: restParams,
      });
    }
    return true;
  }

  // Redirect to auth page
  return router.createUrlTree(['/auth'], { queryParams });
};
