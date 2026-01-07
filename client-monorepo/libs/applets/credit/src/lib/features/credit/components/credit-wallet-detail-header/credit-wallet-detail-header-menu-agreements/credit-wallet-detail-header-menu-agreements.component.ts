import { Component, input, OnInit, output, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditAgreementModel } from '../../../data-access/models/credit/agreements/credit-agreement.model';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import {
  CreditWalletDetailHeaderMenuAgreementsViewComponent
} from './credit-wallet-detail-header-menu-agreements-view/credit-wallet-detail-header-menu-agreements-view.component';
import {
  CreditWalletDetailHeaderMenuAgreementsListComponent
} from './credit-wallet-detail-header-menu-agreements-list/credit-wallet-detail-header-menu-agreements-list.component';

@Component({
  selector: 'app-credit-wallet-detail-header-menu-agreements',
  templateUrl: './credit-wallet-detail-header-menu-agreements.component.html',
  styleUrls: ['./credit-wallet-detail-header-menu-agreements.component.scss'],
  standalone: true,
  imports: [CreditWalletDetailHeaderMenuAgreementsListComponent, CreditWalletDetailHeaderMenuAgreementsViewComponent, NgxSpinnerModule],
})
export class CreditWalletDetailHeaderMenuAgreementsComponent implements OnInit {
  creditId = input.required<string>();

  goMainClicked = output<void>();

  gettingData = signal<boolean | null>(null);
  selectedAgreement = signal<CreditAgreementModel | null>(null);
  agreements = signal<CreditAgreementModel[] | null>(null);

  constructor(private creditApiService: CreditApiService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.gettingData.set(true);
    this.creditApiService.getCreditAgreements(this.creditId()).subscribe({
      next: (response) => {
        this.gettingData.set(false);
        this.agreements.set(response.agreements);
      },
      error: () => {
        this.gettingData.set(false);
      },
    });
  }

  goMain() {
    this.goMainClicked.emit();
  }

  onAgreementHandler($event: CreditAgreementModel) {
    this.selectedAgreement.set($event);
  }

  onBackHandler() {
    this.selectedAgreement.set(null);
  }
}
