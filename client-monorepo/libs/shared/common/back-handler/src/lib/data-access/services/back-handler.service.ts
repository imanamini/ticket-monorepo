import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BackHandlerService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);

  // Variables
  private initialized = false;
  private customLink: string | undefined = undefined;
  private restrictedUrls: string[] = ['payment/result'];

  public init(): void {
    if (this.initialized) return;
    this.initialized = true;
    if (this.comeFromOutside() || this.comeFromRestrictedUrl() || this.isHistoryEmpty()) {
      this.replaceHomeState();
      this.pushCurrentPageState();
    }
    this.startListening();
  }

  public goBack(): void {
    this.location.back();
  }

  public setCustomBackUrl(url: string, force = false): void {
    /**
     * WARNING: If you want this custom Url to work, user should preform an action on the page
     **/
    if (!force) {
      this.setCustomLinkByRouterState(url);
      return;
    }
    this.customLink = this.removeLeadingSlash(url);
  }

  private setCustomLinkByRouterState(fallbackCustomLink = ''): void {
    /**
     * NOTICE: If you want customLinkForBack to work, you should call this function and pass a fallbackCustomLink
     **/
    const stateObj = window?.history?.state;
    const customLinkFromState: string = stateObj && stateObj['customLinkForBack'] ? stateObj['customLinkForBack'] : undefined;
    this.customLink = this.removeLeadingSlash(customLinkFromState || fallbackCustomLink);
  }

  private startListening(): void {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (e) => {
        if (e instanceof NavigationStart) {
          if (e.navigationTrigger === 'popstate') {
            this.handlePopState(e.url, this.customLink);
          }
        }
        if (e instanceof NavigationEnd) {
          if (this.customLink) {
            this.customLink = undefined;
          }
          this.setCustomLinkByRouterState(undefined);
        }
      },
    });
  }

  private handlePopState(destinationUrl: string, customLink?: string): void {
    if (customLink) {
      setTimeout(() => {
        this.replaceHomeState();
        this.navigate(customLink);
      }, 0);
    } else if (this.isRestricted(destinationUrl)) {
      setTimeout(() => {
        this.navigate('/', true);
      }, 0);
    }
  }

  private isRestricted(destination: string): boolean {
    return this.restrictedUrls.some((url) => this.removeLeadingSlash(destination).startsWith(this.removeLeadingSlash(url)));
  }

  private navigate(url: string, replaceUrl = false): void {
    this.router.navigateByUrl(url, { replaceUrl }).then();
  }

  private replaceHomeState(): void {
    window.history.replaceState(null, '', '/');
  }

  private pushCurrentPageState(): void {
    window.history.pushState(null, '', this.router.url);
  }

  private removeLeadingSlash(url: string): string {
    return url.startsWith('/') && url !== '/' ? url.substring(1) : url;
  }

  comeFromOutside(): boolean {
    if (!document.referrer && !this.isHistoryEmpty()) {
      return true;
    }

    try {
      const referrerDomain = new URL(document.referrer).hostname;
      const currentDomain = window.location.hostname;
      return referrerDomain !== currentDomain;
    } catch (error) {
      return false;
    }
  }

  comeFromRestrictedUrl(): boolean {
    if (!document.referrer) {
      return false;
    }

    try {
      const referrerDomain = new URL(document.referrer).hostname;
      const currentDomain = window.location.hostname;
      const referrerPathName = new URL(document.referrer).pathname;
      return referrerDomain === currentDomain && this.isRestricted(referrerPathName);
    } catch (error) {
      return false;
    }
  }

  isHistoryEmpty(): boolean {
    return window.history.length <= 1;
  }

  // Dummy Functions
  disableAutoScroll(): void {}
  enableAutoScroll(): void {}
  destroy(): void {}
  shouldSkipDeferLoading(route: string): boolean {
    return false;
  }
}
