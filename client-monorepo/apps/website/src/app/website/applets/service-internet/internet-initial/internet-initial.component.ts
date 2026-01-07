import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InternetService } from '../internet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UiCarrier } from '../../../../ui/models/ui-carrier';
import { SimType } from '../../../../api/digipay/models/common/sim-type';
import { FavouritePackagesResponse } from '../../../../api/digipay/models/internet/favourite';
import { LayoutService } from '../../../services/layout.service';
import { UserService } from '../../../../core/services/user.service';
import { PaymentService } from '../../../../core/services/payment.service';
import { GuestUserService } from '../../../../core/services/guest-user.service';
import { ScreenSize } from '../../../../api/digipay/models/common/screen-size';
import { InternetBoxData } from '../../../../api/clients/models/templates/internet/internet-template-data';
import { UiSimTypeSwitchComponent } from '../../../../ui/ui-components/ui-cell-number-field/ui-sim-type-switch/ui-sim-type-switch.component';
import { BaseRecommendation } from '../../../../api/digipay/models/recommendation/base-recommendation';
import { InternetPackageSelectComponent } from '../internet-package-select/internet-package-select.component';
import { UiRecommendationsListComponent } from '../../../../ui/ui-components/ui-recommendation/ui-recommendations-list/ui-recommendations-list.component';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { UiCellNumberFieldComponent } from '../../../../ui/ui-components/ui-cell-number-field/ui-cell-number-field/ui-cell-number-field.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-internet-initial',
  templateUrl: './internet-initial.component.html',
  styleUrls: ['./internet-initial.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    UiButtonComponent,
    UiCellNumberFieldComponent,
    FormDirectivesModule,
    UiRecommendationsListComponent,
    UiSimTypeSwitchComponent,
    InternetPackageSelectComponent,
    NgFor,
  ],
})
export class InternetInitialComponent implements OnInit, OnDestroy {
  @Input()
  internetBoxData: InternetBoxData;

  @ViewChild(UiSimTypeSwitchComponent)
  uiSimTypeChild!: UiSimTypeSwitchComponent;

  state: 'SIM_SELECT' | 'PACKAGE_SELECT' = 'SIM_SELECT';

  isMobile = false;

  selectedCarrier: UiCarrier = null;

  cellNumber: string;

  selectedSimType: SimType;

  selectedSimTypeLabel: string;

  basicDataValidness = {
    cellNumber: false,
    simType: false,
    carrier: false,
  };

  validationMessages = {
    cellNumber: null,
  };

  subscriptions: Subscription[] = [];

  favouriteGroups: FavouritePackagesResponse[] = [];

  cachedNumbers: BaseRecommendation[] = [];

  constructor(
    private bottomSheet: MatBottomSheet,
    private layoutService: LayoutService,
    public internetService: InternetService,
    private router: Router,
    private user: UserService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private guestUserService: GuestUserService,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // this.navigationService.setAppState({
    //   title: 'بسته اینترنت',
    //   backButton: {
    //     url: '/',
    //   }
    // });
    this.router.navigate([]);

    this.subscriptions[0] = this.layoutService.screenSizeChanged.subscribe((size) => {
      this.isMobile = size === ScreenSize.isMobile;
    });

    this.subscriptions[1] = this.internetService.selectedCarrier.asObservable().subscribe((carrier) => {
      this.selectedCarrier = carrier;
      this.updateUiChild();
    });

    this.subscriptions[2] = this.internetService.cellNumber.asObservable().subscribe((cellNumber) => {
      this.cellNumber = cellNumber;
    });

    this.subscriptions[3] = this.internetService.selectedSimType.asObservable().subscribe((type) => {
      new Promise((resolve, reject) => {
        this.selectedSimType = type;
        const tmp = this.internetService.simTypes.filter((simType) => simType.value === this.selectedSimType)[0];
        resolve(tmp);
      }).then((result: any) => {
        result && result.label ? (this.selectedSimTypeLabel = result.label) : '';
      });
    });

    this.subscriptions[4] = this.internetService.basicDataValidness.asObservable().subscribe((isValid) => {
      this.basicDataValidness = isValid;
    });

    this.subscriptions[5] = this.internetService.favouriteGroups.asObservable().subscribe((value) => {
      this.favouriteGroups = value;
    });

    this.subscriptions[6] = this.internetService.validationMessages.asObservable().subscribe((value) => {
      this.validationMessages = value;
    });

    this.subscriptions[7] = this.internetService.recommendations.asObservable().subscribe((value) => {
      this.cachedNumbers = value;
    });

    this.internetService.initialize();

    this.internetService.selectedCarrier.next(this.internetService.carriers[0]);

    this.internetService.selectedSimType.next(this.internetService.simTypesGroups[this.selectedCarrier.value][0].value);

    if (this.user.isLoggedIn.getValue()) {
      this.getCampaignCap();
    } else {
      this.cachedNumbers = this.guestUserService.getNumbers();
      if (this.cachedNumbers.length > 0) {
        const lastCellNumber = this.cachedNumbers[this.cachedNumbers.length - 1].id;
        this.internetService.cellNumber.next(lastCellNumber);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  proceedToNextStep(bundleId: string = null): void {
    // reset duration
    this.internetService.selectedDuration.next(-1);

    if (this.state === 'SIM_SELECT') {
      this.changeState('PACKAGE_SELECT');
    }
  }

  changeState(state: 'SIM_SELECT' | 'PACKAGE_SELECT') {
    this.state = state;
  }

  // continueClickMobile(): void {
  //   const simTypes = this.selectedCarrier ?
  //     this.internetService.simTypesGroups[this.selectedCarrier.value] : this.internetService.simTypes;
  //
  //   this.bottomSheet.open(UiSimTypeBottomSheetComponent, {
  //     data: {
  //       simTypes,
  //     }
  //   }).afterDismissed().subscribe((option: UiOption) => {
  //     if (option) {
  //       this.internetService.selectedSimType.next(+option.value);
  //       this.proceedToNextStep();
  //     }
  //   });
  // }

  onCellNumberChange(cellNumber: string): void {
    this.internetService.cellNumber.next(cellNumber);
  }

  onCarrierChange(carrier: UiCarrier): void {
    this.internetService.selectedCarrier.next(carrier);
    this.internetService.selectedSimType.next(this.internetService.simTypesGroups[this.selectedCarrier.value][0].value);
    this.updateUiChild();
  }

  onSimTypeChange(simType: SimType): void {
    this.internetService.selectedSimType.next(simType);
  }

  updateUiChild() {
    if (this.uiSimTypeChild) {
      this.ref.detectChanges();
      this.uiSimTypeChild.uiAnimatedSwitchWindowResize();
    }
  }

  // onFavouritePackageClick(group: FavouritePackagesResponse, internetPackage: InternetPackage): void {
  //   this.internetService.cellNumber.next(group.cellNumber);
  //   this.internetService.selectedSimType.next(group.simType);
  //   const carrier = this.internetService.carriers.filter(c => c.value === group.operatorId)[0];
  //   this.internetService.selectedCarrier.next(carrier);
  //   this.proceedToNextStep(internetPackage.bundleId);
  // }

  recommendationItemClicked(recommendation: BaseRecommendation): void {
    this.internetService.cellNumber.next(recommendation.id);
  }

  private getCampaignCap(): void {
    // this.campaignApi.getCampaignConfig('bundles').subscribe(r => {
    //   this.landingConfig = r.landingConfig;
    //
    //   this.campaignApi.getCampaignCap(r.landingConfig.campaignInfo.type).subscribe(res => {
    //     this.capResponse = res;
    //   });
    // });
  }
}
