import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras, UrlTree } from '@angular/router';
import { Location } from '@angular/common';

export type NavState<T = any> = T & { __ts?: number };

@Injectable({providedIn: 'root'})
export class NavigationService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  /**
   Push: default router, push to history
   */
  public async go(
    commands: any[] | string | UrlTree,
    extras: NavigationExtras & { state?: NavState } = {}
  ): Promise<boolean> {
    // await this.nav.go(['/dashboard'], { queryParams: { tab: 'feed' } });
    return this.router.navigate(
      Array.isArray(commands) ? commands as any[] : [commands],
      {...extras, replaceUrl: false}
    );
  }

  /**
   * Open a route, but set a different Back target
   * Example: from checkout to payment-result, but Back goes to price-list
   * Usage:
   * await this.nav.openWithBackTarget(
   *   ['checkout', 'step-2'],      // current
   *   ['price-list'],              // backTarget
   *   { queryParams: { plan: 'A' } } // extras
   * );
   */
  async openWithBackTarget(
    current: any[] | string,
    backTarget: any[] | string,
    extras?: NavigationExtras
  ): Promise<boolean> {
    // 1) این صفحه (payment-result) را با price-list جایگزین کن
    const ok1 = await this.router.navigate(
      Array.isArray(backTarget) ? backTarget : [backTarget],
      {...extras, replaceUrl: true } // حذف payment-result از history و گذاشتن price-list به‌جای آن
    );
    if (!ok1) {
      return false;
    }

    // 2) حالا checkout را پوش کن؛ Back برمی‌گردد به price-list
    return this.router.navigate(
      Array.isArray(current) ? current : [current],
      {...extras, replaceUrl: false}
    );
  }

  /**
   Replace: prevent push to history
   */
  public async replace(
    commands: any[] | string | UrlTree,
    extras: NavigationExtras & { state?: NavState } = {}
  ): Promise<boolean> {
    // await this.nav.replace(['checkout', 'step-2'], { state: { from: 'step-1' } });
    return this.router.navigate(
      Array.isArray(commands) ? commands as any[] : [commands],
      {...extras, replaceUrl: true}
    );
  }

  /**
   silent: navigate without changing the visible URL in the browser
   useful for modals, side panels, etc.
   the URL in the address bar remains unchanged
   but the router state is updated and components can react to it
   the navigation is not recorded in browser history
   */
  public async silent(
    commands: any[] | string | UrlTree,
    extras: Omit<NavigationExtras, 'skipLocationChange' | 'replaceUrl'> & { state?: NavState } = {}
  ): Promise<boolean> {
    // await this.nav.silent(['products', productId, 'details']);
    return this.router.navigate(
      Array.isArray(commands) ? commands as any[] : [commands],
      {...extras, skipLocationChange: true}
    );
  }

  /**
   Back: go back in history or navigate to fallback if no history
   */
  public back(fallback: any[] | string = ['/'], opts: { hard?: boolean } = {}): void {
    // this.nav.back(['/home']); // اگر History نبود، بره هوم
    if (opts.hard) {
      // History: if there's history, go back
      this.location.back();
      return;
    }
    // Soft: if there's history, go back, else navigate to fallback
    // navigationId is 1 on first load, >1 if there's history
    const prev = !!history.state?.navigationId;
    if (prev) {
      this.location.back();
    } else {
      void this.replace(fallback);
    }
  }

  /**
   example: redirect to home after login
   add a timestamp to state to force route reload even if navigating to the same URL
   */
  public async redirectAfterLogin(): Promise<boolean> {
    return this.replace(['/home'], {state: {from: 'login', __ts: Date.now()}});
  }

  /**
   example: open a modal by navigating to a route with modal state
   the URL in the address bar remains unchanged
   */
  public openModal(route: any[] | string, data?: Record<string, any>): Promise<boolean> {
    return this.silent(route, {state: {modal: true, ...data}});
  }
}
