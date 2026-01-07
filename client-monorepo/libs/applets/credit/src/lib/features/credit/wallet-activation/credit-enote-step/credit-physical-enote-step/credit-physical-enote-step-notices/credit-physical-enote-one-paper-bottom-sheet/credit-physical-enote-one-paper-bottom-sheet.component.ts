import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-credit-physical-enote-one-paper-bottom-sheet',
  templateUrl: './credit-physical-enote-one-paper-bottom-sheet.component.html',
  standalone: true,
  styleUrls: ['./credit-physical-enote-one-paper-bottom-sheet.component.scss'],
  imports: [NgxButtonComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalEnoteOnePaperBottomSheetComponent implements OnInit {
  bottomSheetService = inject(NgxBottomSheetService);
  amount = signal<number | undefined>(undefined);

  ngOnInit() {
    this.amount.set(this.bottomSheetService.data().amount);
  }

  onSubmit() {
    this.bottomSheetService.outputData.set({ nextStep: true });
    this.bottomSheetService.closeBottomSheet();
  }
}
