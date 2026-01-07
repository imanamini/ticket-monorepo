import {Component, Inject, Input, PLATFORM_ID} from '@angular/core';
import {
  CBnplV2TemplateDataResponse
} from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-v2-template-data.response';
import {CreditApiService} from '../../../../../../../api/clients/credit/credit-calculator/credit-api.service';
import {PlanGroup, SERVICE_TYPE} from '../../../../../../../ui/models/credit/credit-plan-group';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../../../../core/services/user.service';
import {DialogBottomSheetService} from '../../../../../../../core/services/dialog-bottom-sheet.service';
import {
  UiDialogLoginComponent
} from '../../../../../../../ui/ui-components/ui-dialogs/ui-dialog-login/ui-dialog-login.component';
import {ViewportScroller, NgIf, NgOptimizedImage, isPlatformBrowser} from '@angular/common';
import {StorageInterface} from '@digipay/ng-storage';
import {StorageSchema} from '../../../../../../../core/models/storage-schema';
import {UiButtonComponent} from '../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {CBnplPromotionBannerComponent} from '../c-bnpl-promotion-banner/c-bnpl-promotion-banner.component';
import {UiIconDirective} from '../../../../../../../ui/ui-directive/ui-icon.directive';
import {environment} from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-c-bnpl-intro',
  templateUrl: './c-bnpl-intro.component.html',
  styleUrls: ['./c-bnpl-intro.component.scss'],
  standalone: true,
  imports: [NgIf, CBnplPromotionBannerComponent, NgOptimizedImage, UiIconDirective, UiButtonComponent],
})
export class CBnplIntroComponent {
  @Input() cBnplData: CBnplV2TemplateDataResponse;
  @Input() isForBaniMode: boolean;

  isGettingPlans = false;

  constructor(
    private creditApiService: CreditApiService,
    private router: Router,
    private userService: UserService,
    private dialog: DialogBottomSheetService,
    private scroller: ViewportScroller,
    private route: ActivatedRoute,
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
  }


  public requestCredit() {
    // const newWindow = window.open('about:blank', '_blank'); // open immediately
    // this.isGettingPlans = true;
    // this.creditApiService.getPlanGroups().subscribe((response) => {
    //   this.isGettingPlans = false;
    //   const allPlans: PlanGroup[] = response.planGroupDetails;
    //   const isBnplOpen = allPlans.some(
    //     (plan) => plan.serviceType === SERVICE_TYPE.BNPL
    //   );
    //
    //   if (isBnplOpen) {
    //     if (isPlatformBrowser(this.platformId)) {
    //       if (newWindow) newWindow.location.href = `${environment.appUrl}/service/bnpl/resolve`;
    //     }
    //   } else {
    //     if (newWindow) newWindow.close();
    //     const queryObject = new URLSearchParams();
    //     const queryParams = {
    //       ...this.route.snapshot.queryParams,
    //       formId: this.cBnplData.cBnplIntro.requestBnplFormId,
    //     };
    //     for (const key in queryParams) {
    //       queryObject.set(key, queryParams[key]);
    //     }
    //     this.userService.redirectUrlAfterLogin =
    //       window.location.origin + '/bnpl/c-bnpl/get-bnpl/?' + queryObject.toString();
    //
    //     if (!this.userService.isLoggedIn.getValue()) {
    //       this.dialog.open(UiDialogLoginComponent, {}).then((result) => {
    //         if (!result?.success) {
    //           this.userService.redirectUrlAfterLogin = '';
    //         }
    //       });
    //     } else {
    //       this.router.navigate(['bnpl/c-bnpl/get-bnpl/.'], {
    //         queryParams: {
    //           formId: this.cBnplData.cBnplIntro.requestBnplFormId,
    //           ...this.route.snapshot.queryParams,
    //         },
    //       });
    //     }
    //   }
    // });
  }

  scrollToStores() {
    this.scroller.setOffset([0, 200]);
    this.scroller.scrollToAnchor('stores-component');
  }

  goToStores() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = '/stores';
    }
  }
  sendRequest() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `${environment.appUrl}/service/bnpl/resolve/?referrer=website `;
    }
  }
}
