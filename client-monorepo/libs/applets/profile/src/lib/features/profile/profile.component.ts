import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { profileMenusConst } from '../../data-access/constants/profile-menus.const';
import { UserPreviewComponent } from '../../components/user-preview/user-preview.component';
import { PayClubPreviewComponent } from '../../components/pay-club-preview/pay-club-preview.component';
import { ProfileMenuGroupComponent } from '../../components/profile-menu-group/profile-menu-group.component';
import { SubscriptionPreviewComponent } from '../../components/subscription-preview/subscription-preview.component';
import { GuideChooserComponent } from '../../components/guide-chooser/guide-chooser.component';
import { AuthService } from '@client-monorepo/common/user';
import { Router } from '@angular/router';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { APP_NAME_ENUM, AppNameService, SupportMessengerService } from '@client-monorepo/common/utilities';
import { LogoutConfirmationComponent } from '../../components/logout-confirmation/logout-confirmation.component';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ProfileMenuGroupInterface } from '../../data-access/models/profile-menu-group-item.interface';
import { DigikalaService } from '@client-monorepo/pillar/digikala';

@Component({
  selector: 'profile-applet-profile',
  standalone: true,
  imports: [
    CommonModule,
    UserPreviewComponent,
    SubscriptionPreviewComponent,
    PayClubPreviewComponent,
    ProfileMenuGroupComponent,
    NgxButtonComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnDestroy {
  bottomSheetService = inject(NgxBottomSheetService);
  authService = inject(AuthService);
  router = inject(Router);
  actionHandlerService = inject(ActionHandlerService);
  supportMessengerService = inject(SupportMessengerService);
  private appNameService = inject(AppNameService);
  private digikalaService = inject(DigikalaService);

  appName: APP_NAME_ENUM = this.appNameService.getAppName();

  @HostBinding('class.pillar-app') get isPillarApp() {
    return this.appNameService.isPillar();
  }
  profileMenus = computed<ProfileMenuGroupInterface[]>(() => {
    const profileMenu: {
      [key: string]: ProfileMenuGroupInterface;
    } = JSON.parse(JSON.stringify(profileMenusConst));

    for (const key in profileMenu) {
      profileMenu[key].menu = profileMenu[key].menu.filter((item) => item?.apps?.includes(this.appName));

      if (!profileMenu[key].menu.length) {
        delete profileMenu[key];
      }
    }

    return Object.values(profileMenu);
  });

  protected readonly APP_NAME_ENUM = APP_NAME_ENUM;

  logout(): void {
    this.bottomSheetService.openBottomSheet(LogoutConfirmationComponent, {}, { noPadding: true });
    this.bottomSheetService.onClose.subscribe(() => {
      if (this.bottomSheetService.outputData() === 'logout') {
        if (this.appNameService.isPillar() && this.digikalaService.isDigikalaSuperApp) {
          this.digikalaService.logout();
        }
        this.authService.logout();
      }
    });
  }

  goToPayClub(): void {
    this.actionHandlerService.handle({
      type: ActionType.REDIRECT,
      payload: {
        url: '/pay-club',
      },
    });
  }

  goToSubscription(): void {
    this.actionHandlerService.handle({
      type: ActionType.REDIRECT,
      payload: {
        url: '/subscription/enter',
      },
    });
  }

  goToInsurance(): void {
    this.actionHandlerService.handle({
      type: ActionType.GO_TO_SERVICE,
      payload: {
        serviceId: FrequentServicesIdEnum.ELECTRICAL_DEVICES_INSURANCE,
      },
    });
  }

  chooseSupportAction(item: string): void {
    switch (item) {
      case 'تماس با پشتیبانی':
        this.support();
        break;
      case 'راهنما':
        this.openGuideChooser();
        break;
      case 'چت با پشتیبانی':
        this.openChat();
        break;
      default:
        this.openChat();
    }
  }

  openChat(): void {
    this.supportMessengerService.showFloatButton.set(false);
    this.supportMessengerService.isVisible.next(true);
    setTimeout(() => {
      this.supportMessengerService.toggleSupportMessenger();
    }, 500);
  }

  support(): void {
    window.open('tel:+982153924000');
  }

  openGuideChooser(): void {
    this.bottomSheetService.openBottomSheet(GuideChooserComponent, null);
  }

  ngOnDestroy(): void {
    this.supportMessengerService.hide();
    this.supportMessengerService.showFloatButton.set(true);
  }
}
