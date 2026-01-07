import { ICompaignState } from '../../models';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ICustomerAgreement } from '../../../../components/core/models/customer-agreement.interface';
import {
  HOME_ROUTE,
  PROSPECTUS_ROUTE,
  TREASURE_HUNT_NATIONAL_ID_ROUTE,
  TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { IAgreementsPdfSource } from '../../models/agreements-pdf-source.interface';
import { CampaignService } from '../../../../components/core/services/v1/campaign.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { CampaignContractGeneratorService } from '../../services/campaign-contract-generator.service';

@Component({
  selector: 'app-campaign-agreements',
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent, NgxCheckboxComponent, SpinnerComponent, NgxDividerComponent],
  templateUrl: './campaign-agreements.component.html',
  styleUrl: './campaign-agreements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignAgreementsComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private campaignService = inject(CampaignService);
  private navigationService = inject(WealthNavigationService);
  private contractGeneratorService = inject(CampaignContractGeneratorService);
  readonly BorderColorsEnum = BorderColorsEnum;

  checked = signal<boolean>(false);
  loading = signal<boolean>(true);
  isUploading = signal<boolean>(false);
  agreements = signal<ICustomerAgreement[]>([]);
  state = signal<ICompaignState | undefined>(undefined);
  pdfSrc = signal<IAgreementsPdfSource | undefined>(undefined);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (!this.state().campaignCode) {
      this.navigationService.navigate([HOME_ROUTE]);
      return;
    }

    this.getPdfs();
  }

  async getPdfs() {
    const contracts = await this.contractGeneratorService.getContracts(this.state().userInfo);

    this.pdfSrc.set(contracts);
    this.loading.set(false);
  }

  onBackHandler() {
    this.navigationService.navigateWithState([TREASURE_HUNT_NATIONAL_ID_ROUTE], {
      state: this.state(),
    });
  }

  confirmAgreement() {
    this.isUploading.set(true);
    this.campaignService.getCampaignProcess(this.state().campaignCode, null, { agreementApprovement: true }).subscribe((res) => {
      if (res?.success) {
        this.navigationService.navigateWithState([TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE], {
          state: {
            ...this.state(),
            remainingDays: res.result.data.remainingDays,
          },
        });
      }
      this.isUploading.set(false);
    });
  }

  displayAgreement(agreement: ICustomerAgreement) {
    const convertToCamelCase = (input: string): string => (input.length === 0 ? '' : input.charAt(0).toLowerCase() + input.slice(1));
    const contractCamelCaseName = convertToCamelCase(agreement.key);

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: {
        pdfFile: this.pdfSrc()?.[contractCamelCaseName + 'Contract'],
        symbol: 'IRTKGANJ0001',
        type: 'campaign',
        agreement: agreement.key,
        agreementTitle: agreement.description,
        campaignData: this.state(),
      },
    });
  }
}
