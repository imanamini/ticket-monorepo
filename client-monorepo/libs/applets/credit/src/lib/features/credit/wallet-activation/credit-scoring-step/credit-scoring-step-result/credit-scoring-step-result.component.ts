import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditScoringStepReportWrapperComponent } from '../credit-scoring-step-report-wrapper/credit-scoring-step-report-wrapper.component';
import { ScoringStatusType } from '../credit-scoring-result-page/credit-scoring-step-result-data';
import { CreditScoringResultPageComponent } from '../credit-scoring-result-page/credit-scoring-result-page.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-credit-scoring-step-result',
  templateUrl: './credit-scoring-step-result.component.html',
  standalone: true,
  styleUrls: ['./credit-scoring-step-result.component.scss'],
  imports: [CreditScoringResultPageComponent, CreditScoringStepReportWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepResultComponent implements OnInit {
  fundProviderCode = signal<number | null>(null);
  creditId = signal<string | null>(null);
  status = signal<ScoringStatusType | null>(null);
  gettingData = signal<boolean | null>(null);
  trackingCode = signal<string | null>(null);
  showReportPage = signal(false);

  activatedRoute = inject(ActivatedRoute);
  creditApiService = inject(CreditApiService);
  creditUrlService = inject(CreditUrlService);
  router = inject(Router);
  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.fundProviderCode.set(parseInt(params['fundProviderCode'], 10));
    this.creditId.set(params['creditId']);
    this.gettingData.set(true);
    this.creditApiService.getBankScoreForFundProvider(this.fundProviderCode()!, this.creditId()!).subscribe({
      next: (response) => {
        this.status.set(response.compute ? 'SUCCESS' : 'FAILED');
        this.trackingCode.set(response.trackingCode);
        this.gettingData.set(false);
      },
      error: () => {
        this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      },
    });
  }

  showReport() {
    this.showReportPage.set(true);
  }
}
