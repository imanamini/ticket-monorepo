import { Injectable } from '@angular/core';
import { AuthDigikalaService, DigikalaAuthErrorService, DigikalaService, DigikalaStorageService } from '@client-monorepo/pillar/digikala';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DigikalaAuthStateService {
  private inflightStatus?: Promise<boolean> | null;
  private cachedResult?: boolean;

  constructor(
    private readonly digikalaService: DigikalaService,
    private readonly authDigikalaService: AuthDigikalaService,
    private readonly storageService: DigikalaStorageService,
    private readonly authErrorService: DigikalaAuthErrorService,
    router: Router,
  ) {
    router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      if (e.urlAfterRedirects.startsWith('/auth')) {
        this.clearCache();
      }
    });
  }

  resolveStatus(): Promise<boolean> {
    if (this.cachedResult !== undefined) {
      return Promise.resolve(this.cachedResult);
    }

    if (this.inflightStatus) {
      return this.inflightStatus;
    }

    this.inflightStatus = this.evaluateStatus()
      .then((result) => {
        this.cachedResult = result;
        return result;
      })
      .finally(() => {
        this.inflightStatus = null;
      });

    return this.inflightStatus;
  }

  // Clear cached auth evaluation before navigating to auth
  public clearCache(): void {
    this.cachedResult = undefined;
    this.inflightStatus = null;
  }

  private async evaluateStatus(): Promise<boolean> {
    if (this.digikalaService.isDigikala) {
      try {
        await this.authDigikalaService.initialLoginDigiPayToDigikala();
      } catch (error) {
        // Don't logout if it's the "has password" error (401 with status 2001)
        // The error has already been saved in DigikalaAuthErrorService
        if (!this.authErrorService.hasPasswordError()) {
          //   this.digikalaService.logout();
        }
        return false;
      }
    }

    return this.storageService.isLoggedIn();
  }
}
