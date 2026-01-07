import { ChangeDetectionStrategy, Component, inject, input, model, output, signal } from '@angular/core';
import { CreditPageDialogComponent } from '../../../components/credit-page-dialog/credit-page-dialog.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditRegistrationFlowTypeDataModel } from '../../services/credit-registration-flow-type-data.model';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-select-registration-flow',
  templateUrl: './credit-select-registration-flow.component.html',
  styleUrls: ['./credit-select-registration-flow.component.scss'],
  imports: [NgxTrackableIdDirective, NgxIcon],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSelectRegistrationFlowComponent {
  headerTitle = signal<string | null>(null);
  journeyTypes = input<CreditRegistrationFlowTypeDataModel[]>([]);
  selectedFlowType = model<string>();
  select = output<string>();

  bottomSheetService = inject(NgxBottomSheetService);

  openLinkUrl(linkTitle: string, linkUrl: string) {
    this.bottomSheetService.openBottomSheet(CreditPageDialogComponent, {
      title: linkTitle,
      absoluteUrl: linkUrl,
    });
  }

  onClick(item: CreditRegistrationFlowTypeDataModel) {
    if (item.active) {
      this.select.emit(item.type);
      this.selectedFlowType.set(item.type);
    }
  }
}
