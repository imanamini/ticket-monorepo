import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CreditProfileStatusResponse } from '../../../data-access/models/credit/activation/credit-profile-status.response';

@Component({
  selector: 'app-credit-profile-status-base',
  template: '',
  styleUrls: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditProfileStatusBaseComponent {
  creditId = input.required<string>();
  fundProviderCode = input.required<number>();
  profileStatusData = input<CreditProfileStatusResponse>();
  reloadStatus = output<void>();
  close = output<void>();

  onReloadData() {
    this.reloadStatus.emit();
  }

  onClose() {
    this.close.emit();
  }
}
