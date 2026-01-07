import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { C2cFrequentTransactionCardComponent } from '../c2c-frequent-transaction-card/c2c-frequent-transaction-card.component';
import { ModifiedC2cFrequentTransaction } from '../../data-access/models/c2c-frequent-transaction-response';

@Component({
  selector: 'c2c-applet-app-indirect-deleting-recommendation',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, C2cFrequentTransactionCardComponent],
  templateUrl: './indirect-deleting-recommendation.component.html',
  styleUrls: ['./indirect-deleting-recommendation.component.scss'],
})
export class IndirectDeletingRecommendationComponent {
  subscriptions: Subscription[] = [];

  recommendations: ModifiedC2cFrequentTransaction[] = [];

  constructor(private bottomSheetService: NgxBottomSheetService) {
    this.recommendations = this.bottomSheetService.data()?.recommendations;
  }

  cancel() {
    this.bottomSheetService.closeBottomSheet();
  }

  save() {
    this.bottomSheetService.outputData.set({ confirmed: true });
    this.bottomSheetService.closeBottomSheet();
  }
}
