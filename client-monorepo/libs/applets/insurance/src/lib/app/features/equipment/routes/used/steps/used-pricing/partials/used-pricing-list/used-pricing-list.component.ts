import { Component, Inject, OnInit } from '@angular/core';
import { CardNoticeComponent } from '../../../../../../../../components/card-notice/card-notice.component';
import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';
import { MatDialogClose } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgFor } from '@angular/common';
import { UsedPricingService } from '../../services/used-pricing.service';
import { PricingListModel } from '../../../../../../api/models/pricing/pricing.model';

@Component({
  selector: 'used-pricing-list',
  standalone: true,
  imports: [
    CardNoticeComponent,
    UiButtonComponent,
    MatDialogClose,
    PipesModule,
    NgFor
  ],
  templateUrl: './used-pricing-list.component.html',
  styleUrl: './used-pricing-list.component.scss'
})
export class UsedPricingListComponent implements OnInit {

  constructor(private sheet: MatBottomSheet,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private usedPricingService: UsedPricingService
  ) {
  }

  pricing: PricingListModel[];

  close(): void {
    this.sheet.dismiss();
  }

  ngOnInit(): void {
    this.pricing = this.usedPricingService.handlePricingList(this.data);
  }
}
