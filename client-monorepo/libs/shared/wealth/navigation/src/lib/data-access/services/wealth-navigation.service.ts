import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface NavigationConfig {
  appName: 'dpx' | 'wealth';
  isPrefix: boolean;
  prefix: string;
}

@Injectable({
  providedIn: 'root'
})
export class WealthNavigationService {
  constructor(
    private router: Router,
    @Inject('APP_CONFIG') private config: NavigationConfig
  ) {
  }

  getCurrentApp(): 'dpx' | 'wealth' {
    return this.config.appName;
  }

  navigate(path: string | string[], options?: { [key: string]: any }) {
    const { isPrefix, prefix } = this.config;
    if (isPrefix) {
      if (Array.isArray(path)) {
        return this.router.navigate([prefix, ...path], options);
      }
      return this.router.navigate([`${prefix}/${path}`], options);
    }
    return this.router.navigate(Array.isArray(path) ? path : [path], options);
  }

  navigateWithQueryParams(
    path: string | string[],
    options: { queryParams: any }
  ) {
    return this.navigate(Array.isArray(path) ? path : [path], options);
  }

  navigateWithOptions(
    path: string | string[],
    options: { [key: string]: any }
  ) {
    return this.navigate(Array.isArray(path) ? path : [path], options);
  }

  navigateWithState(path: string | string[], state: any) {
    return this.navigate(Array.isArray(path) ? path : [path], state);
  }

  getCurrentNavigation() {
    return this.router.getCurrentNavigation();
  }

  getCurrentUrl(): string {
    return this.router.url;
  }

  onNavigationEvents() {
    return this.router.events;
  }
}
