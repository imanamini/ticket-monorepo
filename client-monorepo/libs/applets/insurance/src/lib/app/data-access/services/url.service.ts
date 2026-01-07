import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, DefaultUrlSerializer, Params, Router, UrlSegmentGroup, UrlTree } from '@angular/router';
import { SharedUserSourceService } from './user-services/shared-user-source.service';
import { LoginDataService } from './user-services/login-data.service';

@Injectable({
  providedIn: 'root',
})
export class UrlService extends DefaultUrlSerializer {

  private sharedUserSourceService = inject(SharedUserSourceService);
  private loginDataService = inject(LoginDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  parse(url: string): UrlTree {
    const urlTree = super.parse(url);
    this.lowerCaseSegments(urlTree.root);
    return urlTree;
  }

  private lowerCaseSegments(urlSegmentGroup: UrlSegmentGroup): void {
    if (urlSegmentGroup.hasChildren()) {
      Object.entries(urlSegmentGroup.children).forEach(
        ([key, value]) => this.lowerCaseSegments(value)
      );
    }
    urlSegmentGroup.segments.forEach((segment) => segment.path = segment.path.toLowerCase());
  }

  storeTheRequestedUrl(currentUrl: { url: string, queryParams: Params, fragment?: string } | null = null): void {
    let url = currentUrl?.url ?? this.router.routerState.snapshot.url;
    if (url.includes('?')) {
      url = url.split('?')[0];
    }
    const queryParams = {...this.route.snapshot.queryParams, ...currentUrl?.queryParams};
    delete queryParams.token;
    if (url.includes('auth')) {
      url = '/';
    }
    const fragment = url.includes('#') ? url.split('#')[1] : (this.route.snapshot?.fragment || currentUrl?.fragment);
    url = url.includes('#') ? url.split('#')[0] : url;
    const redirect = {
      url,
      queryParams,
      fragment: fragment
    };
    this.loginDataService.setAfterLoginData(redirect);
    if (url !== '/') {
      this.sharedUserSourceService.afterLoginData.next(redirect);
    }
  }

  getRequestedUrl(): { url: string, queryParams: any, fragment?: string } {
    const item = this.loginDataService.getAfterLoginData();
    if (item) {
      this.sharedUserSourceService.afterLoginData.next(item);
    } else {
      this.sharedUserSourceService.afterLoginData.next({
        url: '',
        queryParams: {},
        fragment: ''
      });
    }
    return this.sharedUserSourceService.afterLoginData.getValue();
  }

  clearURL(): Promise<boolean> {
    return this.router.navigate([], {
      queryParams: {},
      fragment: null,
    });
  }
}
