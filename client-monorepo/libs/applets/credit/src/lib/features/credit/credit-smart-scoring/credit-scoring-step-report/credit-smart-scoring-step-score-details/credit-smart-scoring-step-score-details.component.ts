import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditReportSummary } from '../../../data-access/models/credit-scoring/credit-report-response';

@Component({
  selector: 'app-credit-smart-scoring-score-details',
  templateUrl: './credit-smart-scoring-step-score-details.component.html',
  styleUrls: ['./credit-smart-scoring-step-score-details.component.scss'],
  standalone: true,
  imports: [PipesModule, NgxButtonComponent, NgxTrackableIdDirective, NgxBottomSheetHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringStepScoreDetailsComponent implements OnInit {
  summary = signal<CreditReportSummary | null>(null);
  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    const data = this.bottomSheetService.data();
    if (data) {
      this.summary.set(data.summary);
    }
  }

  backButtonClick() {
    this.bottomSheetService.closeBottomSheet();
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
