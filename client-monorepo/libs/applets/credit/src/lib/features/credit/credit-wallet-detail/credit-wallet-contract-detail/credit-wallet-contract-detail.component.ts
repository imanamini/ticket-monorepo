import { Component, OnInit, signal } from '@angular/core';
import { ContractInstallmentSummaryListResponse } from '../../data-access/models/credit/installment/contract-installment-summary-list.response';
import { ContractInstallmentSummary } from '../../data-access/models/credit/installment/contract-installment-summary';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditWalletDetailSingleContractComponent } from '../credit-wallet-detail-single-contract/credit-wallet-detail-single-contract.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgClass } from '@angular/common';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-wallet-contract-detail',
  templateUrl: './credit-wallet-contract-detail.component.html',
  styleUrls: ['./credit-wallet-contract-detail.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    NgClass,
    CreditScrollableViewComponent,
    CreditWalletDetailSingleContractComponent,
    CreditPageLoadingComponent,
    PipesModule,
  ],
})
export class CreditWalletContractDetailComponent implements OnInit {
  gettingData = signal(false);
  creditId!: string;
  contractTrackingCode!: string;
  data!: ContractInstallmentSummaryListResponse;
  contract!: ContractInstallmentSummary;
  fundProviderCode!: number;
  serviceType!: SERVICE_TYPE;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private creditUrlService: CreditUrlService,
    private creditApiService: CreditApiService,
  ) {}

  ngOnInit(): void {
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.contractTrackingCode = this.activatedRoute.snapshot.params['contractTrackingCode'];
    this.getData();
  }

  getData(): void {
    this.gettingData.set(true);
    this.creditApiService.getWalletInstallments(this.creditId).subscribe({
      next: (response) => {
        this.data = response;
        this.fundProviderCode = response.header.fundProviderCode;
        this.serviceType = response.header.serviceType;
        this.contract = this.data.contracts.find((c) => c.contractTrackingCode === this.contractTrackingCode)!;
        if (!this.contract) {
          this.goToHome();
          return;
        }
        this.gettingData.set(false);
      },
      error: (error) => {
        this.gettingData.set(false);
        console.error('Error loading wallet contract details:', error);
        this.goToHome();
      },
    });
  }

  onBack() {
    window.history.back();
  }

  goToPurchaseDetail() {
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/contract-purchase/${this.contractTrackingCode}/${this.creditId}`))
      .then();
  }

  private goToHome() {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve')).then();
  }
}
