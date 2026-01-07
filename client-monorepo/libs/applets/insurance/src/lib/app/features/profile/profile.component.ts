import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BottomNavigationService } from '../../data-access/services/bottom-navigation.service';
import { UserApiService } from '../../data-access/services/user/user-api.service';
import { LoggedInUser } from '../../data-access/models/logged-in-user.model';
import { UserDetailBriefComponent } from './components/user-detail-brief/user-detail-brief.component';
import { NgxListItemComponent } from '@digipay/ngx-list-item';
import { NgxIcon } from '@digipay/ngx-icon';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { InsButtonComponent } from '../../components/ins-button/ins-button.component';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../data-access/enums/ins-button-size.enum';
import { InsButtonModeEnum } from '../../data-access/enums/ins-button-mode.enum';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { Router } from '@angular/router';
import { InsuranceUrlsEnum } from '../../data-access/enums/insurance-urls.enum';
import { EmptyResultComponent } from '../../components/empty-result/empty-result.component';
import { LoginService } from '../../data-access/services/user-services/login.service';
import { BaseComponent } from '../../components/base/base.component';
import { AuthService } from '@client-monorepo/common/user';
import { InsDigikalaService } from '../../data-access/services/ins-digikala.service';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [
    UserDetailBriefComponent,
    NgxListItemComponent,
    NgxIcon,
    NgxDividerComponent,
    InsButtonComponent,
    NgxSkeletonLoadingComponent,
    EmptyResultComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent extends BaseComponent implements OnInit, OnDestroy {
  userDetail = signal<LoggedInUser>(null);

  private bottomNavigationService = inject(BottomNavigationService);
  private userApiService = inject(UserApiService);
  private authService = inject(AuthService);
  private digikalaService = inject(InsDigikalaService);
  private router = inject(Router);
  private loginService = inject(LoginService);

  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  isLoggedIn = signal(false);

  ngOnInit(): void {
    this.bottomNavigationService.setup();
    this.checkLogin();
  }

  loadUserData(): void {
    this.userApiService.getUserProfile().subscribe({
      next: (value) => {
        this.userDetail.set(value.userDetail);
      },
    });
  }

  navigateToFaq(): void {
    this.router.navigate([InsuranceUrlsEnum.Faq], {
      queryParamsHandling: 'preserve',
    });
  }

  navigateToTermsAndCondition(): void {
    this.router.navigate([InsuranceUrlsEnum.TermsAndCondition], {
      queryParamsHandling: 'preserve',
    });
  }

  exitAccount(): void {
    if (this.digikalaService.isDigikalaSuperApp) {
      this.digikalaService.logout();
    }
    this.authService.logout();
    this.router.navigate(['/'], { relativeTo: this.activatedRoute }).then();
  }

  public handleLoginClicked(): void {
    // this.digikalaService
    //   .initialLoginDigiPayToDigikala()
    //   .then(() => {})
    //   .catch((error) => {
    //     if (this.digikalaService.checkHasErrorIdpPinCode(error)) {
    //       return;
    //     }
    //     this.loginService.routeToLoginPage();
    //   });
  }

  private checkLogin(): void {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    if (this.isLoggedIn()) {
      this.loadUserData();
    }
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.cleanUp();
  }
}
