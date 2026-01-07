import { CanActivateFn, NavigationExtras, Router } from '@angular/router';
import { inject } from '@angular/core';

const checkRedirectGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const param = route.queryParams;

  // rt means redirect to
  if (param['rt']) {
    const currentUrl = window.location.href;

    // Create a URL object to parse the URL
    const url = new URL(currentUrl);

    // Get the route and query parameters from the URL
    const queryParams = url.searchParams.toString();

    // Split the route and query parameters
    const [route, queryParamsString] = decodeURIComponent(queryParams).split('?');

    // Create NavigationExtras object
    const navigationExtras: NavigationExtras = {
      queryParams: queryParamsString
        ? JSON.parse('{"' + queryParamsString.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) =>
            key === '' ? value : decodeURIComponent(value),
          )
        : {},
    };

    // Use Router to navigate to the specified route with query parameters
    router.navigate([route.replace(/rt=/, '')], navigationExtras);
    return false;
  }
  return true;
};

export default checkRedirectGuard;
