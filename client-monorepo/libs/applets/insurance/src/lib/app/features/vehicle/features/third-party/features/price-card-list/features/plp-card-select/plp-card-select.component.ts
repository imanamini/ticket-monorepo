import { Component, inject, OnInit, signal } from '@angular/core';
import { FullScreenLoadingComponent } from '../../../../../../../../components/full-screen-loading/full-screen-loading.component';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { QueryParamService } from '../../../../../../../../data-access/services/query-param.service';
import { ThirdPartyKeysEnum } from '../../../../data-access/enums/third-party-keys.enum';
import { ApplicationFormApiService } from '../../../../../../data-access/services/third-party/application-form-api.service';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';
import { EmptyResultComponent } from '../../../../../../../../components/empty-result/empty-result.component';
import { LoginService } from '../../../../../../../../data-access/services/user-services/login.service';
import { DigikalaService } from '@client-monorepo/pillar/digikala';

@Component({
  selector: 'lib-plp-card-select',
  standalone: true,
  imports: [FullScreenLoadingComponent, EmptyResultComponent],
  templateUrl: './plp-card-select.component.html',
  styleUrl: './plp-card-select.component.scss',
})
export class PlpCardSelectComponent extends BaseComponent implements OnInit {
  private thirdPartySharedService = inject(VehicleSharedService);
  private queryParamService = inject(QueryParamService);
  private applicationFormService = inject(ApplicationFormApiService);
  private loginService = inject(LoginService);
  private digikalaService = inject(DigikalaService);
  isLoggedIn = signal(this.loginService.isLoggedIn);
  isLoading = signal(true);

  ngOnInit(): void {
    if (this.digikalaService.isDigikala) {
      this.checkLogin();
    } else {
      this.selectPlpCard();
    }
  }

  selectPlpCard(): void {
    super.addSubscription(
      this.queryParamService.getQueryParams([ThirdPartyKeysEnum.SelectedPLPCardCompanyId, ThirdPartyKeysEnum.FormId]).subscribe({
        next: (params) => {
          if (params[ThirdPartyKeysEnum.SelectedPLPCardCompanyId] && params[ThirdPartyKeysEnum.FormId]) {
            this.createApplicationDraft(params[ThirdPartyKeysEnum.FormId], params[ThirdPartyKeysEnum.SelectedPLPCardCompanyId]);
          }
        },
      }),
    );
  }

  createApplicationDraft(formId: string, companyId: string): void {
    super.addSubscription(
      this.applicationFormService.createApplicationFormDraft(formId, companyId).subscribe({
        next: (response) => {
          if (response?.success) {
            this.thirdPartySharedService.navigate(ThirdPartyUrlsEnum.OrderCheckout, { replace: true }, InsuranceProductTypeEnum.ThirdParty);
            this.isLoading.set(false);
          }
        },
      }),
    );
  }

  private checkLogin(): void {
    if (this.isLoggedIn()) {
      this.selectPlpCard();
    } else {
      this.isLoading.set(false);
    }
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
}
