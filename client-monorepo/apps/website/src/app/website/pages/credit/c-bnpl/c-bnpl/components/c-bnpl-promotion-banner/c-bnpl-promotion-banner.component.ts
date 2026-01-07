import {Component, HostListener, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {
  CBnplPromotionBannerData
} from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-promotion-banner-data';
import {PlanGroup, SERVICE_TYPE} from '../../../../../../../ui/models/credit/credit-plan-group';
import {
  UiDialogLoginComponent
} from '../../../../../../../ui/ui-components/ui-dialogs/ui-dialog-login/ui-dialog-login.component';
import {DialogBottomSheetService} from '../../../../../../../core/services/dialog-bottom-sheet.service';
import {CreditApiService} from '../../../../../../../api/clients/credit/credit-calculator/credit-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../../../../core/services/user.service';
import {CBnplIntro} from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-v2-template-data.response';
import {isPlatformBrowser, NgIf} from '@angular/common';

@Component({
  selector: 'app-c-bnpl-promotion-banner',
  templateUrl: './c-bnpl-promotion-banner.component.html',
  styleUrls: ['./c-bnpl-promotion-banner.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class CBnplPromotionBannerComponent implements OnInit {
  screenHeight: number;
  screenWidth: number;
  showSection = false;
  screenDeviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  @Input() promotionBanner: CBnplPromotionBannerData;
  @Input() requestBnplFormId: string;
  @Input() isForBaniMode: boolean;
  @Input() intro: CBnplIntro;
  @Input() isIntroSection?: boolean;

  constructor(
    @Inject(PLATFORM_ID) public platformId: string,
    private dialog: DialogBottomSheetService,
    private creditApiService: CreditApiService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.getScreenSize();
      this.showSection = true;
    }
  }

  ngOnInit() {
    this.screenDeviceType = this.calculateDeviceScreenType();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (this.platformId !== 'server') {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      this.screenDeviceType = this.calculateDeviceScreenType();
    }
  }

  calculateDeviceScreenType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.screenWidth < 744) {
      return 'mobile';
    } else if ((this.screenWidth >= 744 && this.screenWidth < 1280) || this.isIntroSection) {
      return 'tablet';
    } else if (this.screenWidth >= 1280) {
      return 'desktop';
    }
  }

  public requestCredit() {
    this.creditApiService.getPlanGroups().subscribe((response) => {
      const allPlans: PlanGroup[] = response.planGroupDetails;
      const isBnplOpen =
        allPlans.filter((plan) => {
          return plan.serviceType === SERVICE_TYPE.BNPL;
        }).length > 0;
      if (isBnplOpen && isPlatformBrowser(this.platformId)) {
        window.location.href = 'https://click.adtrace.io/uhm0gdn';
      } else {
        const queryObject = new URLSearchParams();
        const queryParams = {
          ...this.route.snapshot.queryParams,
          formId: this.requestBnplFormId,
        };
        for (const key in queryParams) {
          queryObject.set(key, queryParams[key]);
        }
        this.userService.redirectUrlAfterLogin = window.location.origin + '/bnpl/c-bnpl/get-bnpl/?' + queryObject.toString();
        if (!this.userService.isLoggedIn.getValue()) {
          this.dialog.open(UiDialogLoginComponent, {}).then((result) => {
            if (!result?.success) {
              this.userService.redirectUrlAfterLogin = '';
            }
          });
        } else {
          this.router.navigate([this.router.url.slice(0, -2) + '/get-bnpl/.'], {
            queryParams: queryParams,
          });
        }
      }
    });
  }
}
