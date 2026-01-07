import { HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

export function isInsuranceRequest(request: HttpRequest<any>, router: Router): boolean {
  return (
    request.url.includes('/insurance') ||
    request.url.includes('/application-forms') ||
    request.url.includes('/vehicle-thirdparty') ||
    router.url.includes('/mini-app/insurance')
  );
}
