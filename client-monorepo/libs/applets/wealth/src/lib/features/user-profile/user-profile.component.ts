import { Component, inject, OnInit, signal } from '@angular/core';
import { UserInfoModel } from './models/user-info.model';
import { UserBankCardComponent } from './components/user-bank-card/user-bank-card.component';
import { UserInfoCardComponent } from './components/user-info-card/user-info-card.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { IManageProfile } from './models/manage-profile.interface';
import { EXPIRED_PASSWORD_ROUTE, HOME_ROUTE } from '../../data-access/constants/app-routes';
import { ProfileService } from '../../components/core/services/profile.service';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ErrorCodes } from '../../data-access/enums/error-codes';
import { UserProfileService } from './services/user-profile.service';
import { UpdateSejamComponent } from './components/update-sejam/update-sejam.component';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgClass } from '@angular/common';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NgClass,
    NgxIcon,
    NgxButtonComponent,
    NgxAppBarComponent,
    UserBankCardComponent,
    UserInfoCardComponent,
    NgxCountDownComponent,
    SpinnerComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  user = signal<UserInfoModel | undefined>(undefined);
  loadingSejami = signal<boolean>(false);
  manageItems = signal<IManageProfile[]>([]);
  timeIsOver = signal<boolean>(true);
  sejamRateLimit = signal<boolean>(false);
  limitTime = signal<number>(300);
  state: any;

  newFeatureAPI = signal<boolean>(true);
  isLoading = signal<boolean>(true);

  private routeState = inject(RouteStateService);
  private messageService = inject(MessageService);
  private profileService = inject(ProfileService);
  private bottomSheet = inject(NgxBottomSheetService);
  private userProfileService = inject(UserProfileService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.initialState();
    this.fetchProfile();
  }

  private initialState() {
    this.state = this.routeState.getAll();
    this.manageItems.set(this.userProfileService.getManagmentItems(['TERMS_AND_CONDITIONS']));
    if (this.state?.['isSejamUpdate']) {
      if (this.state?.['updateSejamSeccess']) {
        this.messageService.showSuccessMessage('اطلاعات شما به‌‌روز رسانی شد.');
        this.profileService.getProfile().subscribe();
      }
    }
  }

  private fetchProfile() {
    this.profileService.getProfile().subscribe((res) => {
      if (res?.success) {
        this.user.set(res.result);
      }

      this.isLoading.set(false);
    });
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  updateSejam() {
    this.loadingSejami.set(true);

    if (this.newFeatureAPI()) {
      this.bottomSheet.openBottomSheet(UpdateSejamComponent, {});

      const bottomSheetService = this.bottomSheet.onClose.subscribe(() => {
        bottomSheetService.unsubscribe();
        this.loadingSejami.set(false);
      });
    } else {
      this.profileService.updateSejamiProfile().subscribe((res) => {
        if (res?.success) {
          this.user.set(res.result);
          this.messageService.showSuccessMessage('اطلاعات شما به‌‌روز رسانی شد.');
        } else {
          if (res?.error?.code == ErrorCodes.RateLimited) {
            this.sejamRateLimit.set(true);
            this.limitTime.set(300);
          }
          this.messageService.showErrorMessage(res?.error?.title);
        }
        this.loadingSejami.set(false);
      });
    }
  }

  goto(route: string) {
    if (route === EXPIRED_PASSWORD_ROUTE) {
      this.navigationService.navigateWithQueryParams([route], {
        queryParams: { type: 'changePassword' },
      });
    } else {
      this.navigationService.navigate([route]);
    }
  }

  timerFinish() {
    this.timeIsOver.set(true);
    this.sejamRateLimit.set(false);
    localStorage.removeItem('LIMIT_TIME');
  }

  timer(time: number) {
    this.limitTime.set(time);
  }
}
