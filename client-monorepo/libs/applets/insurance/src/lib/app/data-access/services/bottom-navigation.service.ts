import { inject, Injectable } from '@angular/core';
import { BottomNavigationItemInterface, NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { BottomNavigationItemEnum } from '../enums/bottom-navigation-item.enum';
import { InsDigikalaService } from './ins-digikala.service';
import { INSURANCE_APP_PREFIX } from '../constants/insurance-app-prefix.constant';

@Injectable({
  providedIn: 'root',
})
export class BottomNavigationService {
  private ngxBottomNavigationService = inject(NgxBottomNavigationService);
  private digikalaService = inject(InsDigikalaService);
  private navigationItems: BottomNavigationItemInterface[] = [];

  public get instanceService(): NgxBottomNavigationService {
    return this.ngxBottomNavigationService;
  }

  setup(): void {
    this.buildNavigationItems();
    this.setNavigationItems();
    this.setReturnItem(false);
    this.setAutomaticNavigationItemActivation();
    this.activateBottomNavigation();
  }

  private setNavigationItems(): void {
    this.ngxBottomNavigationService.setItems(this.navigationItems);
  }

  private buildNavigationItems(): void {
    const items: BottomNavigationItemInterface[] = [
      {
        title: BottomNavigationItemEnum.HOME,
        icon: 'home',
        route: INSURANCE_APP_PREFIX + '/',
      },
      {
        title: BottomNavigationItemEnum.POLICY,
        icon: 'note-shield',
        route: INSURANCE_APP_PREFIX + '/policy/list',
      },
      {
        title: BottomNavigationItemEnum.CLAIM,
        icon: 'wallet',
        route: INSURANCE_APP_PREFIX + '/claim/list',
      },
    ];
    if (this.digikalaService.isDigikala) {
      items.push({
        title: BottomNavigationItemEnum.PROFILE,
        icon: 'person',
        route: INSURANCE_APP_PREFIX + '/profile',
      });
    }
    this.navigationItems = items;
  }

  private setAutomaticNavigationItemActivation(): void {
    this.setActiveItemByURL(window.location.pathname);
  }

  private setActiveItemByURL(url: string): void {
    const activeItem: BottomNavigationItemInterface = this.getActiveNavigationItem(url);
    if (activeItem) {
      this.ngxBottomNavigationService.activateItem(activeItem.title);
    }
  }

  private getActiveNavigationItem(pageUrl: string): BottomNavigationItemInterface | null {
    pageUrl = pageUrl.split('?')[0];
    const item: BottomNavigationItemInterface = this.navigationItems.find((nav) => pageUrl.endsWith(nav.route));
    return item ?? null;
  }

  private activateBottomNavigation(): void {
    this.ngxBottomNavigationService.setLoading(false);
    setTimeout(() => this.ngxBottomNavigationService.show());
  }

  private setReturnItem(status: boolean): void {
    this.ngxBottomNavigationService.returnMode.set(status);
  }

  cleanUp(): void {
    this.ngxBottomNavigationService.hide();
  }
}
