import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  CreditScoringStepResultDataInterface,
  CreditSmartScoringStepResultData,
} from '../credit-smart-scoring-error/credit-smart-scoring-step-result-data';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditSmartScoringStepResultChartComponent } from './credit-smart-scoring-step-result-chart/credit-smart-scoring-step-result-chart.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditSmartScoringStatus } from '../services/credit-smart-scoring.status';

@Component({
  selector: 'app-credit-smart-scoring-result',
  templateUrl: './credit-smart-scoring-result.component.html',
  styleUrls: ['./credit-smart-scoring-result.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    NgxSpinnerModule,
    CreditSmartScoringStepResultChartComponent,
    NgxButtonComponent,
    NgxTrackableIdDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringResultComponent {
  maxCreditAmount = input<number>(0);
  expirationDate = input<number>();
  status = input<CreditSmartScoringStatus>();
  data = computed<CreditScoringStepResultDataInterface>(() => CreditSmartScoringStepResultData[this.status()!]);
  calculatedCreditAmount = computed(() => Math.round(this.maxCreditAmount() / 1_000_000));

  close = output<void>();
  report = output<void>();
  showPlans = output<void>();
}
