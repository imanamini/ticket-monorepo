import { Component, inject } from '@angular/core';
import { BnplErrorHandlingService } from '../services/bnpl-error-handling.service';

@Component({
  selector: 'bnpl-failed-scoring-page',
  templateUrl: './bnpl-failed-scoring-page.component.html',
  styleUrls: ['./bnpl-failed-scoring-page.component.scss']
})
export class BnplFailedScoringPageComponent {
  bnplErrorHandlingService = inject(BnplErrorHandlingService);

  backToMerchant(): void {
    this.bnplErrorHandlingService.backToMerchant();
  }
}
