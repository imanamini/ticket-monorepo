import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-bank-account-verification-step-shahab-help',
  templateUrl: './credit-bank-account-verification-step-shahab-help.component.html',
  styleUrls: ['./credit-bank-account-verification-step-shahab-help.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditScrollableViewComponent, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditBankAccountVerificationStepShahabHelpComponent implements OnInit {
  fundProviderCode!: number;
  creditId!: string;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  creditUrlService = inject(CreditUrlService);

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
  }

  goBack() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/bank-account-verification/${this.fundProviderCode}/${this.creditId}`),
    );
  }
}
