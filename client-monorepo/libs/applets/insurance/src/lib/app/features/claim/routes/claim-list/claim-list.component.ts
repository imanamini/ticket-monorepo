import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmptyResultComponent } from '../../../../components/empty-result/empty-result.component';
import { HistoryClaimListComponent } from './patials/history-claim-list/history-claim-list.component';
import { CurrentClaimListComponent } from './patials/current-claim-list/current-claim-list.component';
import { MainHeaderComponent } from '../../../../components/main-header/main-header.component';
import { InsButtonComponent } from '../../../../components/ins-button/ins-button.component';
import { BottomNavigationService } from '../../../../data-access/services/bottom-navigation.service';
import { UiLoadingSpinnerComponent } from '../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { LoginService } from '../../../../data-access/services/user-services/login.service';
import { ClaimApiService } from '../../../../data-access/services/claim/claim-api.service';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { InsButtonModeEnum } from '../../../../data-access/enums/ins-button-mode.enum';
import { BaseComponent } from '../../../../components/base/base.component';
import { ClaimModel } from '../../../equipment/api/models/claim/claim-models';
import { LoadingService } from '../../../../data-access/services/loading.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { AuthService } from '../../../auth/service/auth.service';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { HeaderService } from '../../../../data-access/services/header.service';
import { FaqCategoryTypeEnum } from '../../../../data-access/enums/faq-category-type.enum';
import { ScrollDirectionDirective, ScrollPayload } from '../../../../data-access/directives/scroll-direction.directive';
import { InsDigikalaService } from '../../../../data-access/services/ins-digikala.service';
import { INSURANCE_APP_PREFIX } from '../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'claim-list',
  standalone: true,
  imports: [
    HistoryClaimListComponent,
    InsButtonComponent,
    UiLoadingSpinnerComponent,
    AsyncPipe,
    EmptyResultComponent,
    CurrentClaimListComponent,
    MainHeaderComponent,
    ScrollDirectionDirective,
    NgStyle,
  ],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss',
})
export class ClaimListComponent extends BaseComponent implements OnInit, OnDestroy {
  private claimApiService = inject(ClaimApiService);
  private authService = inject(AuthService);
  public bottomNavigationService = inject(BottomNavigationService);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private loginService = inject(LoginService);
  public headerService = inject(HeaderService);
  private digikalaService = inject(InsDigikalaService);
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly IconEnum = IconEnum;
  protected readonly FaqCategoryTypeEnum = FaqCategoryTypeEnum;
  protected readonly hideIconRight = signal(this.digikalaService.isDigikala);
  loading$: Observable<boolean> = this.loadingService.getLoading();

  protected isAtPageEnd = signal<boolean>(false);

  claimList: { activeClaims: ClaimModel[]; notActiveClaims: ClaimModel[] } = {
    activeClaims: [],
    notActiveClaims: [],
  };

  hasClaimList = false;
  isLoggedIn = false;

  constructor() {
    super();
    this.loadingService.setLoading(true);
  }

  ngOnInit(): void {
    this.bottomNavigationService.setup();
    this.getData();
  }

  getData(): void {
    this.isLoggedIn = this.loginService.isLoggedIn;
    if (this.isLoggedIn) {
      this.loadingService.setLoading(true);
      super.addSubscription(
        this.authService.userInfo().subscribe((user) => {
          super.addSubscription(
            this.claimApiService
              .getClaimList({
                orders: [],
                restrictions: [
                  {
                    type: 'simple',
                    field: 'customermobile',
                    value: user.data.identity.mobile,
                    operation: 'eq',
                  },
                ],
                page: 1,
                take: 20,
              })
              .subscribe({
                next: (res) => {
                  this.loadingService.setLoading(false);
                  this.setClaimsStatus(res.data);
                  this.hasClaimList = !!res.data.length;
                },
                error: (err) => {
                  this.messageService.showErrorIfExists(err);
                  this.loadingService.setLoading(false);
                },
              }),
          );
        }),
      );
    }
  }

  setClaimsStatus(claims: ClaimModel[]): void {
    this.claimList.activeClaims = claims.filter((claim) => claim.isActiveClaim);
    this.claimList.notActiveClaims = claims.filter((claim) => !claim.isActiveClaim);
  }

  goToRegisterClaim(): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/register/type`]).then();
  }

  handleLoginClicked(): void {
    this.loginService.routeToLoginPage();
  }

  backButtonClicked(): void {
    window.history.back();
  }

  onScroll(scroll: ScrollPayload): void {
    this.isAtPageEnd.set(scroll.scrollPercentage > 95);
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.cleanUp();
  }
}
