import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditPlanConditionsBottomSheetData } from './credit-plan-conditions-bottom-sheet.data';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-plan-conditions-bottom-sheet',
  templateUrl: './credit-plan-conditions-bottom-sheet.component.html',
  styleUrls: ['./credit-plan-conditions-bottom-sheet.component.scss'],
  imports: [NgxTooltipDirective, NgxButtonComponent, NgxTrackableIdDirective, NgxBottomSheetHeaderComponent, NgxIcon],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPlanConditionsBottomSheetComponent implements OnInit {
  data = signal<CreditPlanConditionsBottomSheetData | null>(null);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  private bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit(): void {
    this.data.set(this.bottomSheetService.data());
  }

  onConfirm(): void {
    this.bottomSheetService.outputData.set({ confirmed: true });
    this.close();
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
