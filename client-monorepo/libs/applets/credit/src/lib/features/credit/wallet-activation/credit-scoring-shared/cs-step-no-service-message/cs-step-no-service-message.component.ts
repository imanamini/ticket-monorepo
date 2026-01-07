import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { CreditScoringStepService } from '../../credit-scoring-step/services/credit-scoring-step.service';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-cs-step-no-service-message',
  templateUrl: './cs-step-no-service-message.component.html',
  standalone: true,
  styleUrls: ['./cs-step-no-service-message.component.scss'],
  imports: [CreditPageLoadingComponent, NgxStatusResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsStepNoServiceMessageComponent implements OnInit {
  noServiceTime: [number, number] = [1715705114000, 1715796000000];
  buttons: Buttons[] = [
    {
      id: 'smcScoringNoServiceButton',
      style: 'tinted-on-elevated',
      label: 'خروج',
      mode: 'section',
    },
  ];
  initialized = signal<boolean | null>(null);

  onNext = output<void>();

  creditScoringStepService = inject(CreditScoringStepService);

  ngOnInit(): void {
    setTimeout(() => {
      const nowTs = +new Date();
      if (nowTs <= this.noServiceTime[0] || nowTs >= this.noServiceTime[1]) {
        this.onNext.emit();
      }
      this.initialized.set(true);
    }, 0);
  }

  nextStep() {
    this.onNext.emit();
  }

  exit(): void {
    this.creditScoringStepService.closeFlow();
  }
}
