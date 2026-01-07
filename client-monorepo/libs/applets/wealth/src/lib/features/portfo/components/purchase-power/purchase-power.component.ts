import { Component, inject, OnInit, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { IIntroductionData } from '../../../funds/funds-list/models/introduction.interface';

@Component({
  selector: 'app-purchase-power',
  standalone: true,
  imports: [PipesModule, NgxButtonComponent],
  templateUrl: './purchase-power.component.html',
  styleUrl: './purchase-power.component.scss',
})
export class PurchasePowerComponent implements OnInit {
  private bottomSheet = inject(NgxBottomSheetService);
  data = signal<IIntroductionData>(undefined);

  ngOnInit() {
    this.data.set(this.bottomSheet.data().data);
  }

  close() {
    this.bottomSheet.closeBottomSheet();
  }
}
