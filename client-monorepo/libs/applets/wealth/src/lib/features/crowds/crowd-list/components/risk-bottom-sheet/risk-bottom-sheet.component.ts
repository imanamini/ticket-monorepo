import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { RiskModel } from '../../../data-access/models';

@Component({
  selector: 'app-risk-bottom-sheet',
  standalone: true,
  imports: [NgxButtonComponent, NgxCheckboxComponent],
  templateUrl: './risk-bottom-sheet.component.html',
  styleUrl: './risk-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskBottomSheetComponent implements OnInit {
  private bottomSheet = inject(NgxBottomSheetService);

  agreementChecked = signal<boolean>(false);
  data = signal<RiskModel | undefined>(undefined);

  ngOnInit() {
    this.data.set(this.bottomSheet.data());
  }

  onToggleAgreement(event: any) {
    this.agreementChecked.set(event);
  }

  close() {
    this.bottomSheet.outputData.set(true);
    this.bottomSheet.closeBottomSheet();
  }
}
